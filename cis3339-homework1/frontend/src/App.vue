<!-- App: shared layout for every page (header, navigation, footer); RouterView shows the current page -->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <a class="skip-link" href="#main">Skip to main content</a>

  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/students" class="brand">Student Management</RouterLink>
      <nav aria-label="Main navigation">
        <ul class="nav-list">
          <li><RouterLink to="/students">Students</RouterLink></li>
          <li><RouterLink to="/courses">Courses</RouterLink></li>
          <li><RouterLink to="/enrollments">Enrollments</RouterLink></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="main" class="container page" tabindex="-1">
    <RouterView />
  </main>

  <footer class="site-footer">
    <div class="container">CIS 3339 · Homework 1</div>
  </footer>
</template>