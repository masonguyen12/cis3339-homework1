# CIS-3339-Homework-1

A homework assignment that covers a full stack application for managing students, courses and enrollments.
Vue 3 (Composition API) frontend with Vue Router and Pinia

**Author:** Mason Nguyen

## Features

- **Students:** add (with validation), search by name or ID, view, delete
- **Courses:** add (with validation), list, delete
- **Enrollments:** enroll an existing student in an existing course; view a course roster
- **Data integrity:** duplicate students, courses, and enrollments are rejected; deleting a student or course also removes their enrollments
- Responsive, accessible interface with loading, success, error, and empty states

## Required software

| Software | Version |
|---|---|
| Node.js (includes npm) | 20.19 or newer (tested with version v24.13.1, from `node -v`) |
| MongoDB Community Edition | running locally on port 27017 (tested with v24.13.1) |
| A modern web browser | Chrome, Edge, Firefox, or Safari |

No MongoDB Atlas, cloud database, or credentials are needed.

## Environment variables

The `.env` file in the project root is committed and already configured for local MongoDB:

```
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
PORT=3000
```

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | Connection string for the local MongoDB database |
| `PORT` | Port the Express server listens on (defaults to 3000) |

## Setup and run

### 1. Start MongoDB Community Edition

- **Windows:** MongoDB runs as a Windows service after installation. If it isn't running, open **Services**, find **MongoDB Server**, and click **Start**, or run `net start MongoDB` in an Administrator terminal.
- **macOS (Homebrew):** `brew services start mongodb-community`
- **Linux:** `sudo systemctl start mongod`

No database setup is needed. The app creates the database, collections, and indexes automatically on first start, even if the database is empty or doesn't exist.

### 2. Install, build, and start

From the project root (the folder containing `backend/`, `frontend/`, and this README):

```bash
npm install       # installs root, backend, and frontend dependencies
npm run build     # builds the Vue app into frontend/dist
npm start         # starts the Express server
```

### 3. Open the app

**http://localhost:3000**

## Development mode (optional)

For live reloading while editing code, use two terminals from the project root:

```bash
npm run dev:backend    # Express API on http://localhost:3000 (restarts on save)
npm run dev:frontend   # Vite dev server on http://localhost:5173 (proxies /api to port 3000)
```

Then open **http://localhost:5173**.

## Project structure

```
├─ .env                    MongoDB connection settings (committed, no secrets)
├─ package.json            root scripts: install, build, start
├─ backend/
│  ├─ server.js            Express app: API routes, error handling, serves frontend/dist
│  ├─ models/              Mongoose schemas: Student, Course, Enrollment
│  └─ routes/              REST endpoints: students, courses, enrollments
└─ frontend/               Vue 3 app (Vite)
   └─ src/
      ├─ api/client.js     fetch wrapper; turns server errors into readable messages
      ├─ stores/           Pinia stores: students, courses, enrollments
      ├─ router/           Vue Router routes
      ├─ views/            Students, Courses, Enrollments, Not Found pages
      └─ components/       forms, tables, alerts, loading indicator
```

## REST API

| Method | Endpoint | Description | Responses |
|---|---|---|---|
| GET | `/api/students?search=` | List students, or search by name (case-insensitive) or exact ID | 200 |
| POST | `/api/students` | Add a student `{ studentId, name, phone, zip }` | 201, 400, 409 |
| DELETE | `/api/students/:studentId` | Delete a student and their enrollments | 200, 404 |
| GET | `/api/courses` | List courses | 200 |
| POST | `/api/courses` | Add a course `{ courseId, name }` | 201, 400, 409 |
| DELETE | `/api/courses/:courseId` | Delete a course and its enrollments | 200, 404 |
| GET | `/api/courses/:courseId/students` | Course roster | 200, 404 |
| POST | `/api/enrollments` | Enroll `{ studentId, courseId }` | 201, 400, 404, 409 |

Errors are returned as JSON: `{ "error": "message" }`.

## Design notes

- **Data model:** Enrollments store references (`ObjectId`) to a Student and a Course. Unique indexes on `studentId`, `courseId`, and the `(student, course)` pair let MongoDB itself reject duplicates. The server waits for these indexes to be built before accepting requests, so they apply even on a brand-new database.
- **Referential integrity:** An enrollment is created only after both the student and the course are confirmed to exist. Deleting a student or course first deletes its enrollments.
- **Why Pinia:** The Enrollments page needs the same student and course lists that the Students and Courses pages manage. Keeping them in shared stores means a change on one page (e.g. deleting a course) is immediately reflected on the others (e.g. the enrollment dropdowns and roster).
- **Validation:** Forms validate on the client for quick feedback (required fields, digits-only student ID, 5-digit ZIP), and the server validates again with Mongoose schemas, so invalid data can't be saved by any client.
- **Production serving:** Express serves the built Vue app from `frontend/dist`, with a history fallback so refreshing any page (e.g. `/courses`) loads the app instead of returning 404.

## Testing notes

- The duplicate-record tests intentionally receive HTTP **409 Conflict** responses. Browsers log these in the console's network messages; the app handles them and shows a friendly error.
- To reset to an empty database: drop `cis3339_homework1` in MongoDB Compass (or run `db.dropDatabase()` in `mongosh`), then restart the server.

## AI Assistance
This project was completed with help from Claude (Anthropic), as permitted by the assignment.

- **Planning:** Claude provided a step-by-step implementation plan (backend → MongoDB models → REST API → Vue setup → Pinia stores → views → production build).
- **Code:** Much of the backend (Mongoose models, Express routes, error handling) and frontend (Pinia stores, Vue components, views, CSS) was generated by Claude and then added to the project by me.
- **Debugging:** Claude helped diagnose setup and runtime issues (Vite proxy configuration, Windows PowerShell commands, server restarts, Express 5 routing).
- **My work:** I set up the environment (Node.js, MongoDB Community, Compass), assembled and ran the project, tested every feature against the assignment's Part 3 checklist, fixed errors as they came up, and verified the clean install, production build, and persistence.

I have reviewed and tested the submitted code.
