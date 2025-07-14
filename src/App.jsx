import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodypix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let interval;
    const runBodysegment = async () => {
      const net = await bodypix.load();
      console.log("Bodypix model loaded.");
      interval = setInterval(() => {
        detect(net);
      }, 100);
    };

    const detect = async (net) => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const videoHeight = video.videoHeight;
        const videoWidth = video.videoWidth;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const person = await net.segmentPersonParts(video);
        const coloredPartImage = bodypix.toColoredPartMask(person);

        bodypix.drawMask(
          canvasRef.current,
          video,
          coloredPartImage,
          0.7,
          0,
          false
        );
      }
    };

    runBodysegment();
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </>
  );
}

export default App;
