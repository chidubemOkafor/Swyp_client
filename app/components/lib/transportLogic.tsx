import { useMeetingStore } from "@/app/stores/video/useMeeting";
import mediasoupClient from "mediasoup-client"
import { useSocketStore } from "@/app/ws-functions/ws.config";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useContributorsStore } from "@/app/stores/contributors/useContributorsStore";
import { Device, RtpCapabilities, Transport } from "mediasoup-client/types";

export const useMediaSoup = () => {
    const { mediaStream } = useMeetingStore()
    const { socket, initializeSocket } = useSocketStore()
    const params = useParams()
    const { peers } = useContributorsStore();
    const deviceRef = useRef<Device | null>(null);
    const producerTransportRef = useRef<Transport | null>(null);

    if (!socket) {
        initializeSocket(params.id as string)
    }

    if(!socket) return


    const getLocalVideoTrack = () => {
        if( mediaStream ) {
            const videoTrack = mediaStream.getVideoTracks()[0]
            return videoTrack
        } else {
            console.error("videoRef does not have a media stream")
            throw new Error("videoRef does not have a media stream")
        }
    }

    const mediaSoupParams = {
        track: getLocalVideoTrack(),
        encoding: [
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
        // media soup parameters
    }

    const getRtpCapabilities = async({ rtpCapabilities }: { rtpCapabilities: RtpCapabilities }) => {
        const Device = mediasoupClient.Device
        deviceRef.current = new Device()
        await deviceRef.current.load({
            routerRtpCapabilities: rtpCapabilities
        })

        if (deviceRef.current.rtpCapabilities) {
            const createWebRtcTransport = ({params}: {params: any}) => {
                if(!deviceRef.current) return 
                if(params.error) {
                    console.error(params.error)
                    return
                }
                console.log("createWebRtcTransport",params)

                producerTransportRef.current = deviceRef.current.createSendTransport(params)

                producerTransportRef.current.on('connect', async ({ dtlsParameters }, callback, errback) => {
                    if(!producerTransportRef.current) return 
                    try {
                        // Signal local DTLS parameters to the server side transport
                        socket.emit('transport-connect', {
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
                        socket.emit('transport-produce', {
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

            socket?.emit("createWebRtcTransport", { sender: true }, createWebRtcTransport)
        }
    }

    const connectSendTransport = async () => {
        if(!producerTransportRef.current) return
        const producer = await producerTransportRef.current.produce(mediaSoupParams)
        producer.on('trackended', () => {
            console.log('track ended')

            // close video track
        })

        producer.on('transportclose', () => {
            console.log('transport ended')

            // close video reack
        })
    }

    useEffect(() => {
        const handleMediasoup = () => {
            socket?.emit('getRtpCapabilities',getRtpCapabilities)
        }
        handleMediasoup()
    }, [socket, peers])
}

