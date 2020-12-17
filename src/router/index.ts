import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import authGuard from '@/auth/authGuard';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: authGuard,
  },
  {
    path: '/profile',
    name: 'Profile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/Profile.vue'),
    beforeEnter: authGuard,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
});

export default router;
