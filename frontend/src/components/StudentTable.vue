<!-- StudentTable: shows students in a table; emits 'delete' with the student when Delete is clicked on --> 
<script setup>
defineProps({
  students: { type: Array, required: true },
  deletingId: { type: String, default: '' }, // which row is being deleted right now
})
const emit = defineEmits(['delete'])
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Student ID</th>
          <th scope="col">Phone</th>
          <th scope="col">ZIP</th>
          <th scope="col"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student._id">
          <td>{{ student.name }}</td>
          <td>{{ student.studentId }}</td>
          <td>{{ student.phone }}</td>
          <td>{{ student.zip }}</td>
          <td>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              :disabled="deletingId === student.studentId"
              :aria-label="`Delete ${student.name}`"
              @click="emit('delete', student)"
            >
              {{ deletingId === student.studentId ? 'Deleting…' : 'Delete' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>