<script setup>
import { reactive, ref, computed, nextTick } from 'vue'

defineProps({
  busy: { type: Boolean, default: false }, // true while the page is saving
})
const emit = defineEmits(['submit'])

const emptyForm = () => ({ name: '', studentId: '', phone: '', zip: '' })

const form = reactive(emptyForm())
// A field shows its error only after the user leaves it (blur) or tries to submit
const touched = reactive({ name: false, studentId: false, phone: false, zip: false })
const submitted = ref(false)

// Recalculated automatically whenever any field changes
const errors = computed(() => {
  const e = {}
  const name = form.name.trim()
  const id = form.studentId.trim()
  const phone = form.phone.trim()
  const zip = form.zip.trim()

  if (!name) e.name = 'Name is required.'

  if (!id) e.studentId = 'Student ID is required.'
  else if (!/^\d+$/.test(id)) e.studentId = 'Student ID must contain only digits.'

  if (!phone) e.phone = 'Phone number is required.'
  else if (!/^[0-9()+\-.\s]{7,20}$/.test(phone)) e.phone = 'Enter a valid phone number, e.g. 555-1234.'

  if (!zip) e.zip = 'ZIP code is required.'
  else if (!/^\d{5}$/.test(zip)) e.zip = 'ZIP code must be exactly 5 digits.'

  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

// Returns the error message to display for a field, or '' if none should show yet
function errorFor(field) {
  return (touched[field] || submitted.value) && errors.value[field] ? errors.value[field] : ''
}

async function handleSubmit() {
  submitted.value = true
  if (!isValid.value) {
    // Move keyboard focus to the first field with a problem
    await nextTick()
    const first = Object.keys(errors.value)[0]
    document.getElementById(`student-${first}`)?.focus()
    return
  }
  emit('submit', {
    name: form.name.trim(),
    studentId: form.studentId.trim(),
    phone: form.phone.trim(),
    zip: form.zip.trim(),
  })
}

function reset() {
  Object.assign(form, emptyForm())
  Object.keys(touched).forEach((k) => (touched[k] = false))
  submitted.value = false
}

// Lets the parent page call reset() after a successful save
defineExpose({ reset })
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <div class="form-grid">
      <div class="field">
        <label for="student-name">Name</label>
        <input
          id="student-name"
          v-model="form.name"
          type="text"
          autocomplete="name"
          :aria-invalid="!!errorFor('name')"
          :aria-describedby="errorFor('name') ? 'student-name-error' : undefined"
          @blur="touched.name = true"
        />
        <p v-if="errorFor('name')" id="student-name-error" class="field-error">{{ errorFor('name') }}</p>
      </div>

      <div class="field">
        <label for="student-studentId">Student ID</label>
        <input
          id="student-studentId"
          v-model="form.studentId"
          type="text"
          inputmode="numeric"
          :aria-invalid="!!errorFor('studentId')"
          :aria-describedby="errorFor('studentId') ? 'student-studentId-error' : undefined"
          @blur="touched.studentId = true"
        />
        <p v-if="errorFor('studentId')" id="student-studentId-error" class="field-error">
          {{ errorFor('studentId') }}
        </p>
      </div>

      <div class="field">
        <label for="student-phone">Phone</label>
        <input
          id="student-phone"
          v-model="form.phone"
          type="tel"
          autocomplete="tel"
          placeholder="555-1234"
          :aria-invalid="!!errorFor('phone')"
          :aria-describedby="errorFor('phone') ? 'student-phone-error' : undefined"
          @blur="touched.phone = true"
        />
        <p v-if="errorFor('phone')" id="student-phone-error" class="field-error">{{ errorFor('phone') }}</p>
      </div>

      <div class="field">
        <label for="student-zip">ZIP code</label>
        <input
          id="student-zip"
          v-model="form.zip"
          type="text"
          inputmode="numeric"
          maxlength="5"
          autocomplete="postal-code"
          :aria-invalid="!!errorFor('zip')"
          :aria-describedby="errorFor('zip') ? 'student-zip-error' : undefined"
          @blur="touched.zip = true"
        />
        <p v-if="errorFor('zip')" id="student-zip-error" class="field-error">{{ errorFor('zip') }}</p>
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="busy">
        {{ busy ? 'Adding…' : 'Add student' }}
      </button>
      <button type="button" class="btn btn-secondary" :disabled="busy" @click="reset">Clear</button>
    </div>
  </form>
</template>