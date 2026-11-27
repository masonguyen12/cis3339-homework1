<!-- RosterTable: read-only table of the students enrolled in the selected course -->
<script setup>
defineProps({
  students: { type: Array, required: true },
})
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in students" :key="s._id">
          <td>{{ s.name }}</td>
          <td>{{ s.studentId }}</td>
          <td>{{ s.phone }}</td>
          <td>{{ s.zip }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>