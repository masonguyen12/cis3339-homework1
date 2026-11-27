<!-- CoursesView: Courses page; loads courses on mount, handles add and delete through the courses store -->
<script setup>
import { ref, onMounted } from 'vue'
import { useCourseStore } from '@/stores/courses'
import CourseForm from '@/components/CourseForm.vue'
import CourseTable from '@/components/CourseTable.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

const store = useCourseStore()

const adding = ref(false)
const deletingId = ref('')
const formRef = ref(null)

const addAlert = ref({ type: 'success', text: '' })
const listAlert = ref({ type: 'success', text: '' })

onMounted(() => {
  store.fetchCourses()
})

async function handleAdd(course) {
  adding.value = true
  addAlert.value.text = ''
  try {
    const message = await store.addCourse(course)
    addAlert.value = { type: 'success', text: message }
    formRef.value.reset()
  } catch (e) {
    addAlert.value = { type: 'error', text: e.message }
  } finally {
    adding.value = false
  }
}

async function handleDelete(course) {
  const ok = window.confirm(
    `Delete ${course.courseId} (${course.name})?\nAll enrollments in this course will also be removed.`
  )
  if (!ok) return

  deletingId.value = course.courseId
  listAlert.value.text = ''
  try {
    const message = await store.removeCourse(course.courseId)
    listAlert.value = { type: 'success', text: message }
  } catch (e) {
    listAlert.value = { type: 'error', text: e.message }
  } finally {
    deletingId.value = ''
  }
}
</script>

<template>
  <h1>Courses</h1>

  <section class="card" aria-labelledby="add-course-heading">
    <h2 id="add-course-heading">Add a course</h2>
    <AlertMessage :type="addAlert.type" :message="addAlert.text" @dismiss="addAlert.text = ''" />
    <CourseForm ref="formRef" :busy="adding" @submit="handleAdd" />
  </section>

  <section class="card" aria-labelledby="course-list-heading">
    <h2 id="course-list-heading">All courses ({{ store.count }})</h2>

    <AlertMessage :type="listAlert.type" :message="listAlert.text" @dismiss="listAlert.text = ''" />
    <AlertMessage type="error" :message="store.error" @dismiss="store.error = ''" />

    <LoadingIndicator v-if="store.loading" text="Loading courses…" />
    <p v-else-if="!store.courses.length" class="empty">No courses yet. Add one above.</p>
    <CourseTable
      v-else
      :courses="store.sortedCourses"
      :deleting-id="deletingId"
      @delete="handleDelete"
    />
  </section>
</template>