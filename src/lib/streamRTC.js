const getScreenStream = withAudio => {
  const constraints = {
    audio: withAudio ? true : false,
    video: true
    //Video track :: DEFAULT :: will be added which is screen track
  };
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const stream = navigator.mediaDevices
      .getDisplayMedia(constraints)
      .then(screenStream => {
        console.log("Screen", screenStream);
        return screenStream;
      })
      .catch(err => {
        throw new Error(err);
      });
    return stream;
  } else throw new Error("Get DisplayMedia Error");
};

const getVideoStream = withAudio => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const stream = navigator.mediaDevices
      .getUserMedia({
        audio: withAudio ? true : false,
        video: {
          facingMode: "user"
        }
      })
      .then(videoStream => {
        console.log("WebCam", videoStream);
        return videoStream;
      })
      .catch(err => {
        throw new Error(err);
      });
    return stream;
  } else throw new Error("Get UserMedia Error");
};

const getURL = arg => {
  var url = arg;
  if (
    arg instanceof Blob ||
    arg instanceof File ||
    arg instanceof MediaStream ||
    arg.getTracks
  ) {
    url = URL.createObjectURL(arg);
  }
  return url;
};
export { getScreenStream, getVideoStream, getURL };
