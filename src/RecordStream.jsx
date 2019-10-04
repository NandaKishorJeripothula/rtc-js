import React, { useEffect, useState, useRef } from "react";
import { getScreenStream, getVideoStream, getURL } from "./lib/streamRTC";
import { getModel, proctorActivity } from "./lib/proctorRTC";
const RecordStream = () => {
  const [facesCount, setFacesCount] = useState(0);
  const [warningsCount, setWarningsCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  let localWebCamStream = useRef(null);
  let canvasRef = useRef(null);
  let recordRef = useRef(null);
  let imagePallet = useRef(null);
  const [pics, setPics] = useState([]);
  const handleStreamEnded = () => {
    console.log("::StreamEnded::");
  };

  const handleVideoStream = async (stream, ref) => {
    console.log("handleVideoStream", stream, ref);
    console.log(typeof stream);
    const streamURL = await getURL(stream);
    return new Promise((resolve, reject) => {
      if (!stream || !ref) {
        reject();
      }
      // console.log( getURL(stream));
      ref.current.srcObject = streamURL;
      ref.current.onloadedmetadata = () => {
        resolve();
      };
    });
  };
  const handleStartRecord = async event => {
    event.preventDefault();
    console.log(event.target);
    try {
      const screenStream = await getScreenStream(true);
      console.log(screenStream.getTracks());
      screenStream.getTracks()[0].onended = handleStreamEnded;
    } catch (error) {
      console.log("ere", error);
    }

    const model = getModel;
    Promise.all([
      model,
      handleVideoStream(getVideoStream(false), localWebCamStream)
    ])
      .then(async values => {
        console.log("Model Loaded and Stream Added");
        const modelPath = values[0];
        proctorActivity(
          setPics,
          localWebCamStream.current,
          modelPath,
          1000,
          canvasRef
        );
      })
      .catch(error => {
        console.error(error);
        setErrorMessage("Permissions Denied or Model Error");
      });
  };
  useEffect(() => {
    console.log(pics);
  }, [pics]);
  return (
    <>
      <form action="" onSubmit={handleStartRecord}>
        <input type="text" name="" required id="" />
        <input type="submit" value="Start Record" />
      </form>
      <video
        autoPlay
        playsInline
        muted
        id="localWebCamStream"
        ref={localWebCamStream}
        width="320"
        height="240"
        style={{
          borderRadius: 10,
          border: "solid",
          position: "absolute",
          zIndex: -1
        }}
      />
      <canvas
        ref={canvasRef}
        width="320"
        height="240"
        style={{
          display: "none",
          borderRadius: 10,
          border: "solid",
          borderColor: "red",
          zIndex: 3
        }}
        id="canvas"
      />
    </>
  );
};

export default RecordStream;
