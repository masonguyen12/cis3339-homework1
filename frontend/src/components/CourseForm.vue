<script setup>
import { reactive, ref, computed, nextTick } from 'vue'

defineProps({
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const emptyForm = () => ({ courseId: '', name: '' })

const form = reactive(emptyForm())
const touched = reactive({ courseId: false, name: false })
const submitted = ref(false)

// "cis  3339 " → "CIS 3339", so near-duplicates can't sneak in
const normalizeId = (value) => value.trim().replace(/\s+/g, ' ').toUpperCase()

const errors = computed(() => {
  const e = {}
  const id = normalizeId(form.courseId)
  const name = form.name.trim()

  if (!id) e.courseId = 'Course ID is required.'
  else if (!/^[A-Z0-9 -]{2,20}$/.test(id))
    e.courseId = 'Use letters, numbers, spaces or hyphens (e.g. CIS 3339).'

  if (!name) e.name = 'Course name is required.'
  else if (name.length > 100) e.name = 'Course name must be 100 characters or fewer.'

  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

function errorFor(field) {
  return (touched[field] || submitted.value) && errors.value[field] ? errors.value[field] : ''
}

async function handleSubmit() {
  submitted.value = true
  if (!isValid.value) {
    await nextTick()
    const first = Object.keys(errors.value)[0]
    document.getElementById(`course-${first}`)?.focus()
    return
  }
  emit('submit', {
    courseId: normalizeId(form.courseId),
    name: form.name.trim(),
  })
}

function reset() {
  Object.assign(form, emptyForm())
  Object.keys(touched).forEach((k) => (touched[k] = false))
  submitted.value = false
}

defineExpose({ reset })
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <div class="form-grid">
      <div class="field">
        <label for="course-courseId">Course ID</label>
        <input
          id="course-courseId"
          v-model="form.courseId"
          type="text"
          placeholder="CIS 3339"
          :aria-invalid="!!errorFor('courseId')"
          :aria-describedby="errorFor('courseId') ? 'course-courseId-error' : 'course-courseId-hint'"
          @blur="touched.courseId = true"
        />
        <p v-if="errorFor('courseId')" id="course-courseId-error" class="field-error">
          {{ errorFor('courseId') }}
        </p>
        <p v-else id="course-courseId-hint" class="field-hint">Saved in capital letters.</p>
      </div>

      <div class="field">
        <label for="course-name">Course name</label>
        <input
          id="course-name"
          v-model="form.name"
          type="text"
          placeholder="Enterprise Applications Development"
          :aria-invalid="!!errorFor('name')"
          :aria-describedby="errorFor('name') ? 'course-name-error' : undefined"
          @blur="touched.name = true"
        />
        <p v-if="errorFor('name')" id="course-name-error" class="field-error">{{ errorFor('name') }}</p>
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="busy">
        {{ busy ? 'Adding…' : 'Add course' }}
      </button>
      <button type="button" class="btn btn-secondary" :disabled="busy" @click="reset">Clear</button>
    </div>
  </form>
</template>