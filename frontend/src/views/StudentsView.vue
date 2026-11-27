<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentStore } from '@/stores/students'
import StudentForm from '@/components/StudentForm.vue'
import StudentTable from '@/components/StudentTable.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

const store = useStudentStore()

const searchTerm = ref('')   // what's typed in the search box
const activeSearch = ref('') // what was actually searched ('' = showing everyone)
const adding = ref(false)
const deletingId = ref('')
const formRef = ref(null)    // gives access to StudentForm's reset()

const addAlert = ref({ type: 'success', text: '' })
const listAlert = ref({ type: 'success', text: '' })

// Show search results while a search is active, otherwise all students
const visibleStudents = computed(() =>
  activeSearch.value ? store.searchResults : store.sortedStudents
)

const listHeading = computed(() =>
  activeSearch.value
    ? `Results for "${activeSearch.value}" (${visibleStudents.value.length})`
    : `All students (${store.count})`
)

onMounted(() => {
  store.fetchStudents()
})

async function handleSearch() {
  listAlert.value.text = ''
  const term = searchTerm.value.trim()
  if (!term) {
    clearSearch()
    return
  }
  activeSearch.value = term
  await store.searchStudents(term)
}

function clearSearch() {
  searchTerm.value = ''
  activeSearch.value = ''
  store.searchResults = []
}

async function handleAdd(student) {
  adding.value = true
  addAlert.value.text = ''
  try {
    const message = await store.addStudent(student)
    addAlert.value = { type: 'success', text: message }
    formRef.value.reset()
    // Keep search results accurate if a search is showing
    if (activeSearch.value) await store.searchStudents(activeSearch.value)
  } catch (e) {
    addAlert.value = { type: 'error', text: e.message }
  } finally {
    adding.value = false
  }
}

async function handleDelete(student) {
  const ok = window.confirm(
    `Delete ${student.name} (ID ${student.studentId})?\nTheir course enrollments will also be removed.`
  )
  if (!ok) return

  deletingId.value = student.studentId
  listAlert.value.text = ''
  try {
    const message = await store.removeStudent(student.studentId)
    listAlert.value = { type: 'success', text: message }
  } catch (e) {
    listAlert.value = { type: 'error', text: e.message }
  } finally {
    deletingId.value = ''
  }
}
</script>

<template>
  <h1>Students</h1>

  <section class="card" aria-labelledby="add-student-heading">
    <h2 id="add-student-heading">Add a student</h2>
    <AlertMessage :type="addAlert.type" :message="addAlert.text" @dismiss="addAlert.text = ''" />
    <StudentForm ref="formRef" :busy="adding" @submit="handleAdd" />
  </section>

  <section class="card" aria-labelledby="student-list-heading">
    <h2 id="student-list-heading">{{ listHeading }}</h2>

    <form class="inline-form search-form" role="search" @submit.prevent="handleSearch">
      <div class="field">
        <label for="student-search">Search by name or student ID</label>
        <input id="student-search" v-model="searchTerm" type="search" placeholder="e.g. John or 1001" />
      </div>
      <button type="submit" class="btn btn-primary">Search</button>
      <button v-if="activeSearch" type="button" class="btn btn-secondary" @click="clearSearch">
        Show all
      </button>
    </form>

    <AlertMessage :type="listAlert.type" :message="listAlert.text" @dismiss="listAlert.text = ''" />
    <AlertMessage type="error" :message="store.error" @dismiss="store.error = ''" />

    <LoadingIndicator v-if="store.loading" text="Loading students…" />
    <p v-else-if="!visibleStudents.length" class="empty">
      {{ activeSearch ? `No students match "${activeSearch}".` : 'No students yet. Add one above.' }}
    </p>
    <StudentTable
      v-else
      :students="visibleStudents"
      :deleting-id="deletingId"
      @delete="handleDelete"
    />
  </section>
</template>

<style scoped>
.search-form {
  margin-bottom: 1rem;
}
</style>