import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api/client'
import { useEnrollmentStore } from './enrollments'

export const useStudentStore = defineStore('students', () => {
  // ----- state -----
  const students = ref([])        // every student (used by the Enrollments dropdown)
  const searchResults = ref([])   // results of the last search (Students page)
  const loading = ref(false)
  const error = ref('')

  // ----- getters -----
  const sortedStudents = computed(() =>
    [...students.value].sort((a, b) => a.name.localeCompare(b.name))
  )
  const count = computed(() => students.value.length)

  // ----- actions -----
  async function fetchStudents() {
    loading.value = true
    error.value = ''
    try {
      students.value = await api.get('/students')
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function searchStudents(term) {
    loading.value = true
    error.value = ''
    try {
      searchResults.value = await api.get(`/students?search=${encodeURIComponent(term)}`)
    } catch (e) {
      error.value = e.message
      searchResults.value = []
    } finally {
      loading.value = false
    }
  }

  // add/remove THROW on failure so the form or page can show the message
  async function addStudent(student) {
    const data = await api.post('/students', student)
    students.value.push(data.student)
    return data.message
  }

  async function removeStudent(studentId) {
    const data = await api.delete(`/students/${encodeURIComponent(studentId)}`)
    students.value = students.value.filter((s) => s.studentId !== studentId)
    searchResults.value = searchResults.value.filter((s) => s.studentId !== studentId)
    // The server removed their enrollments, so update any roster on screen too
    useEnrollmentStore().removeStudentFromRoster(studentId)
    return data.message
  }

  return {
    students, searchResults, loading, error,
    sortedStudents, count,
    fetchStudents, searchStudents, addStudent, removeStudent,
  }
})