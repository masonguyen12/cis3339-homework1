<!-- AlertMessage: reusable success/error/info message; emits 'dismiss' when the × is clicked -->
<script setup>
defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['success', 'error', 'info'].includes(v),
  },
  message: { type: String, default: '' },
})

const emit = defineEmits(['dismiss'])
</script>

<template>
  <div
    v-if="message"
    class="alert"
    :class="`alert-${type}`"
    :role="type === 'error' ? 'alert' : 'status'"
  >
    <span>{{ message }}</span>
    <button type="button" class="alert-close" aria-label="Dismiss message" @click="emit('dismiss')">
      ×
    </button>
  </div>
</template>