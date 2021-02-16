const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  imgCollection: {
    type: Array,
  },
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  topic: { type: String },
  location: { type: String },
  info: { type: String },
  // datetime: { type: Date, default: Date.now() },
  datetime: { type: Date, default: new Date() },
  id_proses_pelaporan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "prosesPelaporan",
  },
});

module.exports = mongoose.model("User", userSchema);
