const mongoose = require("mongoose");
const { Schema } = mongoose;

const communicationSchema = new Schema({
  session_id: { type: String },
  question: {
    msg: { type: Array },
    locale_key: { type: String },
    reply_to: { type: String },
    sent_at: { type: Date, default: Date.now() },
  },
  message: {
    identifier: {
      type: String,
    },
    detected_language: { type: String },
    timestamp: { type: Date, default: Date.now() },
  },
  replies: { type: Array },
});

// Create a model
const Communication = mongoose.model("communication", communicationSchema);
// Export the model
module.exports = Communication;
