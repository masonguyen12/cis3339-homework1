<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  students: { type: Array, required: true },
  courses: { type: Array, required: true },
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const studentId = ref('')
const courseId = ref('')
const submitted = ref(false)

const errors = computed(() => ({
  student: studentId.value ? '' : 'Choose a student.',
  course: courseId.value ? '' : 'Choose a course.',
}))

const canSubmit = computed(() => props.students.length > 0 && props.courses.length > 0)

function handleSubmit() {
  submitted.value = true
  if (errors.value.student || errors.value.course) return
  emit('submit', { studentId: studentId.value, courseId: courseId.value })
}

// After a successful enrollment, clear only the student,
// so it's quick to enroll several students in the same course
function resetStudent() {
  studentId.value = ''
  submitted.value = false
}

defineExpose({ resetStudent })
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <div class="form-grid">
      <div class="field">
        <label for="enroll-student">Student</label>
        <select
          id="enroll-student"
          v-model="studentId"
          :disabled="!students.length"
          :aria-invalid="submitted && !!errors.student"
          :aria-describedby="submitted && errors.student ? 'enroll-student-error' : undefined"
        >
          <option value="" disabled>
            {{ students.length ? 'Select a student…' : 'No students available' }}
          </option>
          <option v-for="s in students" :key="s._id" :value="s.studentId">
            {{ s.name }} ({{ s.studentId }})
          </option>
        </select>
        <p v-if="submitted && errors.student" id="enroll-student-error" class="field-error">
          {{ errors.student }}
        </p>
      </div>

      <div class="field">
        <label for="enroll-course">Course</label>
        <select
          id="enroll-course"
          v-model="courseId"
          :disabled="!courses.length"
          :aria-invalid="submitted && !!errors.course"
          :aria-describedby="submitted && errors.course ? 'enroll-course-error' : undefined"
        >
          <option value="" disabled>
            {{ courses.length ? 'Select a course…' : 'No courses available' }}
          </option>
          <option v-for="c in courses" :key="c._id" :value="c.courseId">
            {{ c.courseId }}: {{ c.name }}
          </option>
        </select>
        <p v-if="submitted && errors.course" id="enroll-course-error" class="field-error">
          {{ errors.course }}
        </p>
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="busy || !canSubmit">
        {{ busy ? 'Enrolling…' : 'Enroll student' }}
      </button>
    </div>
  </form>
</template>