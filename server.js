var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require("mongoose");

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var dbUrl =
  "mongodb+srv://<user>:<password>@cluster0.ul5fm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var Message = mongoose.model("Message", {
  name: String,
  message: String,
});

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    if (err) res.sendStatus(500);
    res.status(200).send(messages);
  });
});

app.get("/messages/:name", (req, res) => {
    const name = req.params.name;
    Message.find({name:name}, (err, messages) => {
      if (err) res.sendStatus(500);
      res.status(200).send(messages);
    });
  });

app.post("/messages", async (req, res) => {
  try {
    const message = new Message(req.body);

    await message.save();

    const censored = await Message.findOne({ message: "badword" });

    if (censored) {
      await Message.remove({ _id: censored.id });
    } else {
      io.emit("newMessage", req.body);
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

io.on("connection", (socket) => {
  console.log("socket on");
});

mongoose.connect(dbUrl, (err) => {
  console.log("err mongodb:", err);
});

var server = http.listen(3000, () => {
  console.log("Server listening on port", server.address().port);
});
