import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import CustomerView from "../views/CustomerView.vue";
import LoginView from "../views/LoginView.vue";
import AdminsForm from "../views/AdminsForm.vue";



const routes = [
  { path: "/", component: HomeView },
  { path: "/customer", component: CustomerView },
  { path: "/login", component: LoginView },
  { path: "/admins", component: AdminsForm },
  { path: "/customer/:id", component: CustomerView, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;