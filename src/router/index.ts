import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Goals from '../views/Goals.vue';
import Calendar from '../views/Calendar.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import { auth } from '../firebase';

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
    // Giriş yapmadıysa Login sayfasına yönlendirin
    beforeEnter: (to, from, next) => {
      const user = auth.currentUser; // Giriş yapmış kullanıcıyı kontrol et
      if (user) {
        next('/home'); // Eğer kullanıcı varsa Home sayfasına yönlendir
      } else {
        next(); // Kullanıcı yoksa Login sayfasında kal
      }
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    // Giriş yapılmadıysa Login sayfasına yönlendirin
    beforeEnter: (to, from, next) => {
      const user = auth.currentUser; // Giriş yapmış kullanıcıyı kontrol et
      if (!user) {
        next('/'); // Eğer kullanıcı yoksa Login sayfasına yönlendir
      } else {
        next(); // Kullanıcı varsa Home sayfasında kal
      }
    },
  },
  {
    path: '/goals',
    name: 'Goals',
    component: Goals,
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Değişiklik burada
  routes,
});

export default router;
