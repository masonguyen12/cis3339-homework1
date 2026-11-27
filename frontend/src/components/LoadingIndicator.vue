<!-- LoadingIndicator: spinner + text shown while data is loading -->
<script setup>
defineProps({
  text: { type: String, default: 'Loading…' },
})
</script>

<template>
  <p class="loading" role="status">
    <span class="spinner" aria-hidden="true"></span>
    {{ text }}
  </p>
</template>