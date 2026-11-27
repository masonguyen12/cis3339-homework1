<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useStudentStore } from '@/stores/students'
import { useCourseStore } from '@/stores/courses'
import { useEnrollmentStore } from '@/stores/enrollments'
import EnrollForm from '@/components/EnrollForm.vue'
import RosterTable from '@/components/RosterTable.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

const studentStore = useStudentStore()
const courseStore = useCourseStore()
const enrollmentStore = useEnrollmentStore()

const enrolling = ref(false)
const formRef = ref(null)
const enrollAlert = ref({ type: 'success', text: '' })

// Which course's roster is shown. Starts from the store, so it's remembered between pages.
const rosterCourse = ref(enrollmentStore.rosterCourseId)

const loadingOptions = computed(() => studentStore.loading || courseStore.loading)
const optionsError = computed(() => studentStore.error || courseStore.error)

const selectedCourse = computed(() =>
  courseStore.courses.find((c) => c.courseId === rosterCourse.value)
)

onMounted(async () => {
  await Promise.all([studentStore.fetchStudents(), courseStore.fetchCourses()])
  // If the remembered course was deleted in the meantime, forget it
  if (rosterCourse.value && !selectedCourse.value) {
    rosterCourse.value = ''
  } else if (rosterCourse.value) {
    enrollmentStore.fetchRoster(rosterCourse.value)
  }
})

// Whenever the roster dropdown changes, load that course's students
watch(rosterCourse, (courseId) => {
  enrollmentStore.fetchRoster(courseId)
})

async function handleEnroll({ studentId, courseId }) {
  enrolling.value = true
  enrollAlert.value.text = ''
  try {
    const message = await enrollmentStore.enroll(studentId, courseId)
    enrollAlert.value = { type: 'success', text: message }
    formRef.value.resetStudent()
    // Show the roster for the course they just enrolled into
    rosterCourse.value = courseId
  } catch (e) {
    enrollAlert.value = { type: 'error', text: e.message }
  } finally {
    enrolling.value = false
  }
}
</script>

<template>
  <h1>Enrollments</h1>

  <section class="card" aria-labelledby="enroll-heading">
    <h2 id="enroll-heading">Enroll a student in a course</h2>

    <AlertMessage :type="enrollAlert.type" :message="enrollAlert.text" @dismiss="enrollAlert.text = ''" />
    <AlertMessage type="error" :message="optionsError" @dismiss="studentStore.error = ''; courseStore.error = ''" />

    <LoadingIndicator v-if="loadingOptions" text="Loading students and courses…" />
    <template v-else>
      <p v-if="!studentStore.count || !courseStore.count" class="alert alert-info">
        You need at least one student and one course before enrolling.
        <span v-if="!studentStore.count"><RouterLink to="/students">Add a student</RouterLink>.</span>
        <span v-if="!courseStore.count"> <RouterLink to="/courses">Add a course</RouterLink>.</span>
      </p>
      <EnrollForm
        ref="formRef"
        :students="studentStore.sortedStudents"
        :courses="courseStore.sortedCourses"
        :busy="enrolling"
        @submit="handleEnroll"
      />
    </template>
  </section>

  <section class="card" aria-labelledby="roster-heading">
    <h2 id="roster-heading">Course roster</h2>

    <div class="field roster-picker">
      <label for="roster-course">Show students enrolled in</label>
      <select id="roster-course" v-model="rosterCourse" :disabled="!courseStore.count">
        <option value="">Select a course…</option>
        <option v-for="c in courseStore.sortedCourses" :key="c._id" :value="c.courseId">
          {{ c.courseId }}: {{ c.name }}
        </option>
      </select>
    </div>

    <AlertMessage type="error" :message="enrollmentStore.error" @dismiss="enrollmentStore.error = ''" />

    <p v-if="!rosterCourse" class="empty">Choose a course to see its students.</p>
    <LoadingIndicator v-else-if="enrollmentStore.loading" text="Loading roster…" />
    <template v-else>
      <p class="muted" aria-live="polite">
        {{ enrollmentStore.rosterCount }}
        {{ enrollmentStore.rosterCount === 1 ? 'student' : 'students' }} enrolled in
        <strong>{{ selectedCourse?.courseId }}</strong>
      </p>
      <p v-if="!enrollmentStore.rosterCount" class="empty">No students are enrolled in this course yet.</p>
      <RosterTable v-else :students="enrollmentStore.roster" />
    </template>
  </section>
</template>

<style scoped>
.roster-picker {
  max-width: 420px;
  margin-bottom: 1rem;
}
</style>