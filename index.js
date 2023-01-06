/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const { spawn } = require("child_process");
const { v4: uuid } = require("uuid");
const app = express();
const { PythonShell } = require("python-shell");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const NodeMediaServer = require('node-media-server')

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*',
  },
};

app.use(express());
app.use(cors());


app.post("/sendbase", upload.single("image"), (req, res) => {
  console.log(req.body);
  const name = req.body[0];
  const count = req.body[2];
  //console.log(name);
  //console.log(count);
  const base64 = req.body[1].base64;
  const base64Data = base64.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(`./uploads/${name}_${count}.png`, buffer);



  if (!req.file) {
    res.send({ code: 500, msg: "err" });
  } else {
    res.send({ code: 200, msg: "success" });
  }
});

app.get("/runscript", (req, res) => {
  PythonShell.run("script1.py", null, function (err, result) {
    console.log(result);
    res.send(result);
  });
  //  res.send("Script started!! Be patient Please this took too long!!");
});

app.listen(3000, () => console.log("API is Running...."));

var nms = new NodeMediaServer(config);
nms.run();