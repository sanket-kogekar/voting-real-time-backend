const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3000/",
      "https://easy-voting-site.netlify.app/",
      "http://easy-voting-site.netlify.app/",
      "http://easy-voting-site.netlify.app",
      "https://easy-voting-site.netlify.app",
    ],
  },
});
const port = process.env.PORT || 5000;

let sockets = [];
let pollQuestion = "";

const getPrecretedQuestion = () => {
  return pollQuestion;
};

io.on("connection", (socket) => {
  socket.join("WaitingRoom");
  sockets.push(socket);

  socket.on("start-voting", (questionValue) => {
    pollQuestion = questionValue;
    socket.to("WaitingRoom").emit("new-question", pollQuestion);
  });

  socket.on("fetch-pre-created-question", () => {
    const preCreatedQuestion = getPrecretedQuestion();
    console.log("preCreatedQuestion", preCreatedQuestion);
    socket.emit("fetch-pre-created-question", preCreatedQuestion);
  });

  socket.on("submit-selected-poll-option", (pollAnswerDetails) => {
    socket.to("WaitingRoom").emit("poll-selection", pollAnswerDetails);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
