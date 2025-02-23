import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Chat from './views/Chat.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/chat', component: Chat, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
