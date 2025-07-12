import { useMeetingStore } from "@/app/stores/video/useMeeting";
import { useSocketStore } from "@/app/ws-functions/ws.config";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useParams } from "next/navigation";

export function useMakeCall() {
    const { socket, initializeSocket } = useSocketStore();
    const { mediaStream } = useMeetingStore();
    const remoteStreamRef = useRef<MediaStream>(new MediaStream());
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const hasAddedTracks = useRef(false);
    const params = useParams();

    useEffect(() => {
        if (!socket) {
            initializeSocket(params.id as string);
            return;
        }

        if (!peerConnectionRef.current) {
            peerConnectionRef.current = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            });

            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log("Generated ICE candidate: ", event.candidate);
                    socket.emit("webrtc:signal", {
                        "new-ice-candidate": event.candidate,
                    });
                }
            };

            peerConnectionRef.current.onconnectionstatechange = () => {
                console.log("Connection state: ", peerConnectionRef.current?.connectionState);
                if (peerConnectionRef.current?.connectionState === "connected") {
                    console.log("✅ WebRTC peer connected");
                }
            };

            peerConnectionRef.current.ontrack = (event) => {
                console.log("Received remote track:", event.track);
                remoteStreamRef.current.addTrack(event.track);
            };
        }

        const handleOffer = async (value: any) => {
            if (value.offer && peerConnectionRef.current && mediaStream) {
                console.log("Received offer");
                await peerConnectionRef.current.setRemoteDescription(
                    new RTCSessionDescription(value.offer)
                );

                if (!hasAddedTracks.current) {
                    mediaStream.getTracks().forEach((track) =>
                        peerConnectionRef.current?.addTrack(track, mediaStream)
                    );
                    hasAddedTracks.current = true;
                }

                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socket.emit("webrtc:signal", { answer });
            }
        };

        const handleIce = async (value: any) => {
            if (value.iceCandidate && peerConnectionRef.current) {
                try {
                    console.log("Adding remote ICE candidate");
                    await peerConnectionRef.current.addIceCandidate(value.iceCandidate);
                } catch (e) {
                    console.error("Failed to add ICE candidate", e);
                }
            }
        };

        socket.on("webrtc:offer", handleOffer);
        socket.on("webrtc:ice-candidate", handleIce);

        return () => {
            socket.off("webrtc:offer", handleOffer);
            socket.off("webrtc:ice-candidate", handleIce);
        };
    }, [socket, mediaStream]);

    async function makeCall(socket: Socket) {
        if (!mediaStream || !peerConnectionRef.current) return;

        if (!hasAddedTracks.current) {
            mediaStream.getTracks().forEach((track) =>
                peerConnectionRef.current?.addTrack(track, mediaStream)
            );
            hasAddedTracks.current = true;
        }

        socket.on("webrtc:answer", async (value: any) => {
            if (value.answer) {
                console.log("Received answer");
                await peerConnectionRef.current?.setRemoteDescription(
                    new RTCSessionDescription(value.answer)
                );
            }
        });

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        console.log("Sending offer:", offer);
        socket.emit("webrtc:signal", { offer });
    }

    return { makeCall, remoteStreamRef };
}
