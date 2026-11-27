// Student Model: The studentId is unique and cannot have duplicates; ZIP code must have exactly 5 digits
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: [true, 'Student ID is required'], unique: true, trim: true },
    name:      { type: String, required: [true, 'Name is required'], trim: true },
    phone:     { type: String, required: [true, 'Phone is required'], trim: true },
    zip: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true,
      match: [/^\d{5}$/, 'ZIP code must be 5 digits'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);