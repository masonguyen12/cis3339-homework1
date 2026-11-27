<!-- NotFoundView: shown for any URL that doesn't match a route -->
<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="card empty">
    <h1>Page not found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <RouterLink to="/students" class="btn btn-primary">Go to Students</RouterLink>
  </section>
</template>