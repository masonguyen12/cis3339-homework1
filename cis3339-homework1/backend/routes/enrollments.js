const express = require('express');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

// POST /api/enrollments  body: { studentId, courseId }
router.post('/', async (req, res) => {
  const { studentId, courseId } = req.body;
  if (!studentId || !courseId) {
    return res.status(400).json({ error: 'Both a student and a course are required' });
  }

  // Referential integrity: both must already exist
  const [student, course] = await Promise.all([
    Student.findOne({ studentId: String(studentId) }),
    Course.findOne({ courseId: String(courseId) }),
  ]);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const enrollment = await Enrollment.create({ student: student._id, course: course._id });
  res.status(201).json({
    message: `${student.name} enrolled in ${course.courseId}`,
    enrollment,
  });
});

module.exports = router;