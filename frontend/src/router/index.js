import { createRouter, createWebHistory } from 'vue-router'
import StudentsView from '@/views/StudentsView.vue'
import CoursesView from '@/views/CoursesView.vue'
import EnrollmentsView from '@/views/EnrollmentsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/students' },
    { path: '/students', name: 'students', component: StudentsView, meta: { title: 'Students' } },
    { path: '/courses', name: 'courses', component: CoursesView, meta: { title: 'Courses' } },
    { path: '/enrollments', name: 'enrollments', component: EnrollmentsView, meta: { title: 'Enrollments' } },
    // Any other URL → friendly "not found" page
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'Page not found' } },
  ],
})

// Update the browser tab title on every navigation
router.afterEach((to) => {
  document.title = `${to.meta.title} | Student Management`
})

export default router