<!-- CourseTable: shows courses in a table; emits 'delete' with the course when Delete is clicked on --> 
<script setup>
defineProps({
  courses: { type: Array, required: true },
  deletingId: { type: String, default: '' },
})
const emit = defineEmits(['delete'])
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th scope="col">Course ID</th>
          <th scope="col">Course name</th>
          <th scope="col"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course._id">
          <td>{{ course.courseId }}</td>
          <td>{{ course.name }}</td>
          <td>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              :disabled="deletingId === course.courseId"
              :aria-label="`Delete ${course.courseId}`"
              @click="emit('delete', course)"
            >
              {{ deletingId === course.courseId ? 'Deleting…' : 'Delete' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>