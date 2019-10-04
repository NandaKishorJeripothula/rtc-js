import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const getModel = cocoSsd.load("lite_mobilenet_v2");

const proctorActivity = (setPics, stream, model, interval, canvasRef) => {
  const imageGrabber = canvasRef.current;
  console.log("imggra", imageGrabber);
  imageGrabber.width = stream.width;
  imageGrabber.height = stream.height;
  const captureImageCanvas = imageGrabber;
  setInterval(async () => {
    await imageGrabber
      .getContext("2d")
      .drawImage(stream, 0, 0, imageGrabber.width, imageGrabber.height);
    detectFrame(imageGrabber, model, captureImageCanvas, canvasRef, setPics);
  }, interval);
};

const detectFrame = async (
  input,
  model,
  captureImageCanvas,
  canvasRef,
  setPics
) => {
  model.detect(input).then(async predictions => {
    if (!predictions.length) {
      console.log("No image");
      console.log("No one detected");
      //   setErrorMessage("No one detected");
      console.log(0);
      //   setFacesCount(0);

      console.log("warin", prevWarningsCount => prevWarningsCount + 1);
      //   setWarningsCount(prevWarningsCount => prevWarningsCount + 1);
      captureImage(input, captureImageCanvas, Date());
    } else if (
      !(predictions.length === 1 && predictions[0].class === "person")
    ) {
      console.log("Suspicious Activity Detected");
      //   setErrorMessage("Suspicious Activity Detected");
      console.log(predictions.length);
      //   setFacesCount(predictions.length);
      console.log(prevWarningsCount => prevWarningsCount + 1);
      //   setWarningsCount(prevWarningsCount => prevWarningsCount + 1);
      console.log("Suspicious");
      await renderPredictions(predictions, canvasRef);
      captureImage(input, captureImageCanvas, Date(), canvasRef, setPics);
    } else {
      console.log(1);
      //   setFacesCount(1);
      console.log("");
      //   setErrorMessage("");
      //   renderPredictions(predictions);
    }
  });
};

const captureImage = (input, captureImageCanvas, date, canvasRef, setPics) => {
  captureImageCanvas
    .getContext("2d")
    .drawImage(
      input,
      0,
      0,
      captureImageCanvas.width,
      captureImageCanvas.height
    );
  captureImageCanvas
    .getContext("2d")
    .drawImage(
      canvasRef.current,
      0,
      0,
      captureImageCanvas.width,
      captureImageCanvas.height
    );
  // let img = document.createElement("img");
  // img.classList.add("capturedImage");
  // img.src = captureImageCanvas.toDataURL();
  setPics(prevPics => [...prevPics, captureImageCanvas.toDataURL()]);
  // imagePallet.current.appendChild(img);
};

const renderPredictions = (predictions, canvasRef) => {
  const ctx = canvasRef.current.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // Font options.
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";
  predictions.forEach(prediction => {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    const width = prediction.bbox[2];
    const height = prediction.bbox[3];
    // Draw the bounding box.
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);
    // Draw the label background.
    ctx.fillStyle = "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
  });

  predictions.forEach(prediction => {
    const x = prediction.bbox[0];
    const y = prediction.bbox[1];
    // Draw the text last to ensure it's on top.
    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);
  });
};
export { getModel, proctorActivity };
