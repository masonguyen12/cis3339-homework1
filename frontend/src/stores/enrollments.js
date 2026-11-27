import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api/client'

export const useEnrollmentStore = defineStore('enrollments', () => {
  const roster = ref([])          // students in the selected course
  const rosterCourseId = ref('')  // which course the roster belongs to
  const loading = ref(false)
  const error = ref('')

  const rosterCount = computed(() => roster.value.length)

  async function fetchRoster(courseId) {
    rosterCourseId.value = courseId
    if (!courseId) {
      roster.value = []
      return
    }
    loading.value = true
    error.value = ''
    try {
      roster.value = await api.get(`/courses/${encodeURIComponent(courseId)}/students`)
    } catch (e) {
      error.value = e.message
      roster.value = []
    } finally {
      loading.value = false
    }
  }

  async function enroll(studentId, courseId) {
    const data = await api.post('/enrollments', { studentId, courseId })
    // If the roster for that course is on screen, refresh it
    if (rosterCourseId.value === courseId) {
      await fetchRoster(courseId)
    }
    return data.message
  }

  // Called by the other stores after a delete, so the screen never shows stale data
  function removeStudentFromRoster(studentId) {
    roster.value = roster.value.filter((s) => s.studentId !== studentId)
  }

  function clearRosterFor(courseId) {
    if (rosterCourseId.value === courseId) {
      roster.value = []
      rosterCourseId.value = ''
    }
  }

  return {
    roster, rosterCourseId, loading, error,
    rosterCount,
    fetchRoster, enroll, removeStudentFromRoster, clearRosterFor,
  }
})