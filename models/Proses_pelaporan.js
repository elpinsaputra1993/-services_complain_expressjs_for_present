const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Proses_pelaporanSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id_pelapor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  status: { type: String, default: "Menunggu Antrian" },
  datetime: { type: Date, default: new Date() },
});

const Proses = mongoose.model("prosesPelaporan", Proses_pelaporanSchema);
module.exports = Proses;
