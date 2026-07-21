import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import ShopView from "../views/ShopView.vue";
import AdminsForm from "../views/AdminsForm.vue";
import InsertForm from "@/views/InsertForm.vue";
import UpdateForm from "@/views/UpdateForm.vue";

const routes = [
    { path: "/", component: HomeView },
    { path: "/shop", component: ShopView },
    { path: "/admins", component: AdminsForm },
    { path: "/edit/:id", component: UpdateForm, props: true },
    { path: "/insert", component: InsertForm },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;