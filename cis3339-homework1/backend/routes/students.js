const express = require('express');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');

const router = express.Router();

// Makes user input safe to use inside a regex (e.g. a search for "a.b")
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/students            → all students
// GET /api/students?search=jo  → name contains "jo" (any case), or ID is exactly "jo"
router.get('/', async (req, res) => {
  const search = String(req.query.search || '').trim();
  const filter = search
    ? { $or: [{ name: { $regex: escapeRegex(search), $options: 'i' } }, { studentId: search }] }
    : {};
  const students = await Student.find(filter).sort({ name: 1 });
  res.json(students);
});

// POST /api/students  body: { studentId, name, phone, zip }
router.post('/', async (req, res) => {
  const { studentId, name, phone, zip } = req.body;
  const student = await Student.create({ studentId, name, phone, zip });
  res.status(201).json({ message: `Student ${student.name} added`, student });
});

// DELETE /api/students/1001  → deletes the student AND their enrollments
router.delete('/:studentId', async (req, res) => {
  const student = await Student.findOne({ studentId: req.params.studentId });
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  const { deletedCount } = await Enrollment.deleteMany({ student: student._id });
  await student.deleteOne();
  res.json({ message: `Student ${student.name} deleted`, enrollmentsRemoved: deletedCount });
});

module.exports = router;