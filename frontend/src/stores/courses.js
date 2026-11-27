import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api/client'
import { useEnrollmentStore } from './enrollments'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref('')

  const sortedCourses = computed(() =>
    [...courses.value].sort((a, b) => a.courseId.localeCompare(b.courseId))
  )
  const count = computed(() => courses.value.length)

  async function fetchCourses() {
    loading.value = true
    error.value = ''
    try {
      courses.value = await api.get('/courses')
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function addCourse(course) {
    const data = await api.post('/courses', course)
    courses.value.push(data.course)
    return data.message
  }

  async function removeCourse(courseId) {
    const data = await api.delete(`/courses/${encodeURIComponent(courseId)}`)
    courses.value = courses.value.filter((c) => c.courseId !== courseId)
    useEnrollmentStore().clearRosterFor(courseId)
    return data.message
  }

  return {
    courses, loading, error,
    sortedCourses, count,
    fetchCourses, addCourse, removeCourse,
  }
})