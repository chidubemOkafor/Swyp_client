import { useMeetingStore } from "@/app/stores/video/useMeeting";
import mediasoupClient from "mediasoup-client";
import { useSocketStore } from "@/app/ws-functions/ws.config";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useContributorsStore } from "@/app/stores/contributors/useContributorsStore";
import { Consumer, Device, Producer, RtpCapabilities, Transport } from "mediasoup-client/types";
import { getUserId } from "@/app/stores/auth/useAuthStore";

export const useMediaSoup = () => {
    const { mediaStream } = useMeetingStore();
    const { socket } = useSocketStore();
    const { peers } = useContributorsStore();
    const deviceRef = useRef<Device | null>(null);
    const producerTransportRef = useRef<Transport | null>(null);
    const producerRef = useRef<Producer | null>(null);
    const consumerTransportRef = useRef<Transport | null>(null);
    const consumerRef = useRef<Consumer | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const [ foreignProducer, setForeignProducer ] = useState<Map<string, string> | null> (null)
    const [ producers, setProducers ] = useState<Map<string, Map<string, Producer>> | null>(new Map());

    const getLocalVideoTrack = () => {
        const track = mediaStream.getVideoTracks()[0];

        return {
            track,
            encodings: [
                { rid: "r0", maxBitrate: 100000, scalabilityMode: "S1T3" },
                { rid: "r1", maxBitrate: 300000, scalabilityMode: "S1T3" },
                { rid: "r2", maxBitrate: 900000, scalabilityMode: "S1T3" },
            ],
            codecOptions: {
                videoGoogleStartBitrate: 1000,
            },
        };
    };

    const getRtpCapabilities = async ({ rtpCapabilities }: { rtpCapabilities: RtpCapabilities }) => {
        try {
            deviceRef.current = new mediasoupClient.Device();
            await deviceRef.current.load({ routerRtpCapabilities: rtpCapabilities });
        } catch (error) {
            console.error("Failed to load device:", error);
            throw error;
        }
    };

    const createWebRtcTransport = async ({ params }: any) => {
        if (!deviceRef.current || params.error) {
            console.error(params.error);
            return;
        }

        console.log("createWebRtcTransport", params);
        producerTransportRef.current = deviceRef.current.createSendTransport(params);

        producerTransportRef.current.on("connect", async ({ dtlsParameters }, callback, errback) => {
            try {
                socket?.emit("transport-connect", { dtlsParameters });
                callback();
            } catch (error) {
                errback(error as Error);
            }
        });

        producerTransportRef.current.on("produce", async (parameters, callback, errback) => {
            try {
                socket?.emit("transport-produce", {
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData,
                }, ({ id }: { id: any }) => callback({ id }));
            } catch (error) {
                errback(error as Error);
            }
        });

        await connectSendTransport();
    };

    const connectSendTransport = async () => {
        if (!producerTransportRef.current) return;

        const mediasoupParams = getLocalVideoTrack();
        producerRef.current = await producerTransportRef.current.produce(mediasoupParams);

        const userId = await getUserId();
        setProducers(prev => {
            const updated = new Map(prev || []);
            const innerMap = updated.get(userId) || new Map();
            innerMap.set(producerRef.current!.kind, producerRef.current!);
            updated.set(userId, innerMap);
            return updated;
        });

        producerRef.current.on("trackended", () => {
            console.log("track ended");
            remoteVideoRef.current!.srcObject = null;
        });

        producerRef.current.on("transportclose", () => {
            console.log("transport ended");
            remoteVideoRef.current!.srcObject = null;
        });
    };

    const createRecvTransport = () => {
        socket?.emit("createWebRtcTransport", { sender: false }, async ({ params }: any) => {
            if (!deviceRef.current || !params || !params.id) {
                console.error("Invalid transport params", params);
                return;
            }

            consumerTransportRef.current = deviceRef.current.createRecvTransport(params);

            consumerTransportRef.current.on("connect", async ({ dtlsParameters }, callback, errback) => {
                try {
                    socket.emit("transport-recv-connect", { dtlsParameters });
                    callback();
                } catch (error) {
                    errback(error as Error);
                }
            });

            await connectRecvTransport();
        });
    };

    const connectRecvTransport = async () => {
        if (!deviceRef.current || !consumerTransportRef.current) return;

        socket?.emit("consume", {
            rtpCapabilities: deviceRef.current.rtpCapabilities,
        }, async ({ consumers, error }: any) => {
            if (error) {
                console.log("Cannot consume:", error);
                return;
            }

            for (const params of consumers) {
                if(!consumerTransportRef.current) return 
                const consumer = await consumerTransportRef.current.consume({
                    id: params.id,
                    producerId: params.producerId,
                    kind: params.kind,
                    rtpParameters: params.rtpParameters,
                });

                consumerRef.current = consumer;

                if (params.kind === "video") {
                    const stream = new MediaStream([consumer.track]);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = stream;
                        await remoteVideoRef.current.play().catch(err => {
                            console.warn("Autoplay failed:", err);
                        });
                    }
                } else if (params.kind === "audio") {
                    const audioEl = new Audio();
                    audioEl.srcObject = new MediaStream([consumer.track]);
                    audioEl.autoplay = true;
                    document.body.appendChild(audioEl);
                }
            }
        });
    };

    const addProducer = () => {
        socket?.on("new-producer", ({ userId, username, kind, producerId }) => {
            console.log("New producer from user:", userId, username, kind, producerId);
            // Optional: fetch updated consumer list or trigger consume again
            createRecvTransport();
            
            setForeignProducer(prev => {
                const updated = new Map(prev);
                updated.set(userId, producerId);
                return updated;
            });

            console.log("foreignProducer:", foreignProducer)
        });
    };

    useEffect(() => {
        addProducer()

        return () => {
            socket?.off("new-producer")
        }
    }, [foreignProducer])

    useEffect(() => {
        if(mediaStream.active === false) {
            producerRef.current?.close()
            console.log("closed the producer transport")
        }
    }, [mediaStream])

    useEffect(() => {
        if (!socket) return;

        const handleMediaSoup = async () => {
            try {
                socket.emit("getRtpCapabilities", async ({ rtpCapabilities }: any) => {
                    await getRtpCapabilities({ rtpCapabilities });

                    if (mediaStream.active) {
                        socket.emit("createWebRtcTransport", { sender: true }, async ({ params }: any) => {
                            await createWebRtcTransport({ params });
                        });
                    }
                });

                addProducer()
            } catch (e) {
                console.error("Error during mediasoup setup:", e);
            }
        };

        handleMediaSoup();

        return () => {
        //     producerRef.current?.close();
        //     producerTransportRef.current?.close();
        //     consumerRef.current?.close();
        //     consumerTransportRef.current?.close();
        //     deviceRef.current = null;

            socket.off("getRtpCapabilities");
            socket.off("createWebRtcTransport");
            socket.off("consume");
            socket.off("new-producer");
        };
    }, [socket, peers]);

    return {
        remoteVideoRef,
        closeProducer: () => producerRef.current?.close(),
        pauseVideo: () => producerRef.current?.pause(),
        resumeVideo: () => producerRef.current?.resume(),
    };
};