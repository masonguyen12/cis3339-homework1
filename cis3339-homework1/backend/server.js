const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Unknown /api/... URL → JSON 404 (not an HTML page)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ===== Serve the built Vue app =====
const distPath = path.join(__dirname, '..', 'frontend', 'dist');

// Real files (JS, CSS, images) from the build
app.use(express.static(distPath));

// History fallback: any other GET gets index.html, so Vue Router can show the right page.
// Express 5 syntax: '/{*splat}' (the old '*' crashes in Express 5)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res
        .status(500)
        .send('The frontend has not been built yet. Run "npm run build" in the project folder, then restart the server.');
    }
  });
});

// One place that turns errors into proper HTTP responses
app.use((err, req, res, next) => {
  // Bad JSON in the request body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }
  // Schema rules broken (required, match, ...)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join('. ');
    return res.status(400).json({ error: message });
  }
  // Unique index broken → duplicate
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const messages = {
      studentId: 'A student with that ID already exists',
      courseId: 'A course with that ID already exists',
      student: 'That student is already enrolled in this course',
    };
    return res.status(409).json({ error: messages[field] || 'That record already exists' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    // Build the unique indexes before accepting requests (important on an empty database)
    await Promise.all([Student.init(), Course.init(), Enrollment.init()]);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });