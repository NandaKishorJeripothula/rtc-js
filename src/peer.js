import io from "socket.io-client";

const config = {
  // eslint-disable-line no-unused-vars
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

/*global socket, video, config*/
const peerConnections = {};

/** @type {MediaStreamConstraints} */
const constraints = {
  // audio: true,
  video: { facingMode: "user" }
};

export default function callSocket(video) {
  console.log(video);
  //   let peerConnection;
  const socket = io.connect("http://127.0.0.1:5000");

  if (video.src || video.srcObject) {
    console.log("found Video calling socket");
    socket.emit("broadcaster");
  }
  /*global socket, video, config*/
  socket.on("connect", function() {
    console.log("connected");
    socket.emit("watcher");
  });

  //   socket.on("broadcaster", function() {
  //     console.log("from broadcaster");
  //     socket.emit("watcher");
  //   });
  socket.on("watcher", function(id) {
    console.log("watcher called");
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;
    peerConnection.addStream(video.srcObject);
    peerConnection
      .createOffer()
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(function() {
        console.log("emittig offer");
        socket.emit("offer", id, peerConnection.localDescription);
      });
    peerConnection.onicecandidate = function(event) {
      if (event.candidate) {
        socket.emit("candidate", id, event.candidate);
      }
    };
  });

  socket.on("candidate", function(id, candidate) {
    console.log("candidate received");
    // console.log(peerConnections[id]);
    peerConnections[id]
      .addIceCandidate(new RTCIceCandidate(candidate))
      .catch(e => console.error(e));
  });

  socket.on("answer", function(id, description) {
    peerConnections[id].setRemoteDescription(description);
  });

  socket.on("bye", function(id) {
    peerConnections[id] && peerConnections[id].close();
    delete peerConnections[id];
    console.log("socket closed");
  });
}
