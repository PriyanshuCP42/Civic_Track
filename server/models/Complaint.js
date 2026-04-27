import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  id:              { type: String, required: true, unique: true },
  title:           { type: String, required: true },
  citizenId:       { type: String, required: true },
  citizenName:     { type: String, required: true },
  category:        { type: String, required: true },
  description:     { type: String, required: true },
  address:         { type: String, default: "" },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  imageUrl:        { type: String, default: "" },
  images:          [String],
  status:          { type: String, default: "pending" },
  assignedTo:      { type: String, default: null },
  resolutionNotes: { type: String, default: "" },
  submittedAt:     { type: Date, default: Date.now },
  history: [
    {
      status: String,
      actor:  String,
      note:   String,
      at:     { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("Complaint", complaintSchema);
