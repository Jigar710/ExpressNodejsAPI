//imports
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const clc = require("cli-color");
const env = require("./envConfig");
const indexRouter = require("./src/routes/index.routes");

const app = express();

//attaching middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
    // credentials: true,
  })
);
app.use("/api/", indexRouter);

port = env.PORT || 3000;

app.listen(port, () => {
  console.log(clc.blackBright(`ENV : ${process.env.NODE_ENV}`));
  console.log(clc.bgBlueBright(`server is running on port:${port}....`));
});
