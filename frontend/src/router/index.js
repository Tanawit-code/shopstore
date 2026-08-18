import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import CustomerView from "../views/CustomerView.vue";
import LoginView from "../views/LoginView.vue";
import AdminsForm from "../views/AdminsForm.vue";
import RegisterView from "../views/RegisterView.vue";
import InsertForm from "../views/InsertForm.vue";
import UpdateForm from "../views/UpdateForm.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/shop", component: HomeView },
  { path: "/customer", component: CustomerView },
  { path: "/customer/:id", component: CustomerView, props: true },

  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },

  { path: "/admins", component: AdminsForm },

  { path: "/insert", component: InsertForm },

  { path: "/edit/:id", component: UpdateForm, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;