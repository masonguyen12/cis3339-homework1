// Enrollment model: The enrollments links to one Student to one Course by their MongoDB _id
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course',  required: true },
  },
  { timestamps: true }
);

// The same student can't be enrolled in the same course twice
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);