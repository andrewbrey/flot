const server = require("live-server");
const path = require("path");

const options = {
  host: "0.0.0.0",
  port: 5500,
  root: path.join(__dirname, "..", "website"),
  open: true,
  file: "index.html",
  watch: path.join(__dirname, "..", "website"),
  noCssInject: true,
};

server.start(options);
