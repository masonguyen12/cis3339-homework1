const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

// GET /api/courses
router.get('/', async (req, res) => {
  const courses = await Course.find().sort({ courseId: 1 });
  res.json(courses);
});

// POST /api/courses  body: { courseId, name }
router.post('/', async (req, res) => {
  const { courseId, name } = req.body;
  const course = await Course.create({ courseId, name });
  res.status(201).json({ message: `Course ${course.courseId} added`, course });
});

// DELETE /api/courses/CIS%203339  → deletes the course AND its enrollments
router.delete('/:courseId', async (req, res) => {
  const course = await Course.findOne({ courseId: req.params.courseId });
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const { deletedCount } = await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();
  res.json({ message: `Course ${course.courseId} deleted`, enrollmentsRemoved: deletedCount });
});

// GET /api/courses/CIS%203339/students  → everyone enrolled in that course
router.get('/:courseId/students', async (req, res) => {
  const course = await Course.findOne({ courseId: req.params.courseId });
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const enrollments = await Enrollment.find({ course: course._id }).populate('student');
  const students = enrollments.map((e) => e.student).filter(Boolean);
  res.json(students);
});

module.exports = router;