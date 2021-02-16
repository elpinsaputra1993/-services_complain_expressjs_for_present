const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const config = require("./config/keys");
const cors = require("cors");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use("/public", express.static("public"));

require("./routes/dialogFlowRoutes")(app);

require("./routes/sessionRoute")(app);
require("./routes/prosesData")(app);

//DB Config
const db = config.mongoURI;

//Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

if (process.env.NODE_ENV === "production") {
  // js and css files
  app.use(express.static("client/build"));

  // index.html for all page routes
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log("Server Semangat 21 is running on Port: " + PORT);
});
