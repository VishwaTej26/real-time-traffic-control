import React, { useEffect, useRef } from "react";
import { getSocket } from "../lib/socket";

export default function TrafficCanvas() {
  const canvasRef = useRef(null);
  const carsRef = useRef([]);
  const signalRef = useRef({ greenH: true });

  const isHost = useRef(true); // toggle manually

  useEffect(() => {
    const socket = getSocket();

    socket.on("traffic:state", (data) => {
      if (!isHost.current) {
        carsRef.current = data.cars;
        signalRef.current = data.signal;
      }
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function loop() {
      if (isHost.current) {
        // simulate simple movement
        carsRef.current.push({ x: Math.random()*800, y: Math.random()*800 });

        const socket = getSocket();
        socket.emit("traffic:update", {
          cars: carsRef.current,
          signal: signalRef.current
        });
      }

      ctx.clearRect(0,0,800,800);
      for (let c of carsRef.current) {
        ctx.fillRect(c.x, c.y, 5, 5);
      }

      requestAnimationFrame(loop);
    }

    loop();
  }, []);

  return <canvas ref={canvasRef} width={800} height={800} />;
}
