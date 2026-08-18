import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import CustomerView from "../views/CustomerView.vue";
import LoginView from "../views/LoginView.vue";
import AdminsForm from "../views/AdminsForm.vue";
import RegisterView from "../views/RegisterView.vue";
import InsertForm from "../views/InsertForm.vue";



const routes = [
  { path: "/", component: HomeView },
  { path: "/shop", component: HomeView },
  { path: "/customer", component: CustomerView },
  { path: "/login", component: LoginView },
  { path: "/admins", component: AdminsForm },
  { path: "/customer/:id", component: CustomerView, props: true },
  { path: "/register", component: RegisterView },
  { path: "/insertForm", component: InsertForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;