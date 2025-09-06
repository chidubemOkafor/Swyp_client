import { useMeetingStore } from "@/app/stores/video/useMeeting";
import mediasoupClient from "mediasoup-client"
import { useSocketStore } from "@/app/ws-functions/ws.config";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useContributorsStore } from "@/app/stores/contributors/useContributorsStore";
import { Consumer, Device, Producer, RtpCapabilities, Transport } from "mediasoup-client/types";

export const useMediaSoup = () => {
    const { mediaStream } = useMeetingStore()
    const { socket, initializeSocket } = useSocketStore()
    const params = useParams()
    const { peers } = useContributorsStore();
    const deviceRef = useRef<Device | null>(null);
    const producerTransportRef = useRef<Transport | null>(null);
    const producerRef = useRef<Producer | null>(null)
    const consumerTransportRef = useRef <Transport | null>(null)
    const consumerRef = useRef<Consumer | null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

    const getLocalVideoTrack = () => {
        const track = mediaStream.getVideoTracks()[0]

        const mediasoupParams = {
            track,
            encodings: [
                {
                rid: 'r0',
                maxBitrate: 100000,
                scalabilityMode: 'S1T3'
                },
                {
                rid: 'r1',
                maxBitrate: 300000,
                scalabilityMode: 'S1T3'
                },
                {
                rid: 'r2',
                maxBitrate: 900000,
                scalabilityMode: 'S1T3'
                },
            ],
            codecOptions: {
                videoGoogleStartBitrate: 1000
            }
        };

        return mediasoupParams
    }

    const getRtpCapabilities = async({ rtpCapabilities }: { rtpCapabilities: RtpCapabilities }) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                deviceRef.current = new mediasoupClient.Device()
                await deviceRef.current.load({
                    routerRtpCapabilities: rtpCapabilities
                })
                resolve()
            } catch (error) {
                console.error("Failed to load device:", error)
                reject(error)
            }
        })
       
    }

    const createWebRtcTransport = async ({ params }: {params: any}) => {
        if(!deviceRef.current) return 
        if(params.error) {
            console.error(params.error)
            return
        }
        console.log("createWebRtcTransport",params)

        console.log(1)
        producerTransportRef.current = deviceRef.current.createSendTransport(params)

        await connectSendTransport()

        producerTransportRef.current.on('connect', async ({ dtlsParameters }, callback, errback) => {
            if(!producerTransportRef.current) return 
            try {
                // Signal local DTLS parameters to the server side transport
                socket?.emit('transport-connect', {
                    transportId: producerTransportRef.current.id,
                    dtlsParameters: dtlsParameters,
                })

                // Tell the transport that parameters were transmitted.
                callback()
            } catch (error) {
                errback(error as Error)
            }
        })

        producerTransportRef.current.on('produce', async (parameters, callback, errback) => {
            if(!producerTransportRef.current) return 
            console.log(parameters)
            try {
                socket?.emit('transport-produce', {
                    transportId: producerTransportRef.current.id,
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData
                }, ({ id }: { id: any }) => {
                    callback({ id })
                })
            } catch (error) {
                errback(error as Error)
            }
        })   
    }

    const connectSendTransport = async () => {
        if(!producerTransportRef.current) return

        const mediasoupParams = getLocalVideoTrack()
        producerRef.current = await producerTransportRef.current.produce(mediasoupParams)
        producerRef.current.on('trackended', () => {
            console.log('track ended')

            // close video track
        })

        producerRef.current.on('transportclose', () => {
            console.log('transport ended')

            // close video reack
        })
    }

    // consumers
    const createRecvTransport = async () => {
        socket?.emit('createWebRtcTransport', { sender: false }, async({ params }: any) => {
            if(params.error) {
                console.log(params.error)
                return
            }

            console.log("createRecvTransport",params)

            if(!deviceRef.current) return

            consumerTransportRef.current = deviceRef.current?.createRecvTransport(params)

            await connectRecvTransport()

            consumerTransportRef.current.on("connect", async ({ dtlsParameters }, callback, errback) => {
                if(!consumerTransportRef.current) return
                try {
                    socket.emit('transport-recv-connect', {
                        dtlsParameters
                    })

                    callback()
                } catch(error) {
                    errback(error as Error)
                } 
            })
        })

    }

    const connectRecvTransport = async () => {
        socket?.emit('consume', {
            rtcCapabilities: deviceRef.current?.rtpCapabilities
        }, async ({ params }: any) => {
            if(params.error) {
                console.log("cannot consume")
                return
            }

            console.log(params)
            console.log(0.1)
            if(!consumerTransportRef.current) return
            console.log("id: ", 1)
            consumerRef.current = await consumerTransportRef.current.consume({
                id: params.id,
                producerId: params.producerId,
                kind: params.kind,
                rtpParameters: params.rtpParameters
            })
            console.log("id: ", 2)
            const { track } = consumerRef.current

            console.log("track",track)

            if(remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = new MediaStream([track])
            }
            
        })
    }
 
    useEffect(() => {
        const handleMediaSoup = async () => {
            if (!socket) {
                initializeSocket(params.id as string);
                return;
            }

            socket.emit('getRtpCapabilities', async({ rtpCapabilities }: any) => {
                try {
                    await getRtpCapabilities({ rtpCapabilities })
                    socket.emit("createWebRtcTransport", { sender: true }, (params: any) => {
                        createWebRtcTransport({ params })
                    })

                    await createRecvTransport()
                } catch (e) {
                    console.error("Error during mediasoup setup:", e)
                }
            })
        }
        handleMediaSoup()
    }, [socket, peers])
}

