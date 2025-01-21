import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import {useAuthStore} from "@/stores/auth.js";
import LoginComponent from "@/views/Login.vue";
import RegisterComponent from "@/views/Register.vue";
import Cart from "@/views/Cart.vue";
import Orders from "@/views/Orders.vue";
import Init from "@/views/Init.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: LoginComponent
        },
        {
            path: "/register",
            name: "register",
            component: RegisterComponent
        },
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/cart",
            name: "cart",
            component: Cart,
            meta: { requiresAuth: true }
        },
        {
            path: "/orders",
            name: "orders",
            component: Orders,
            meta: { requiresAuth: true }
        },
        {
            path: "/init",
            name: "init",
            component: Init,
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;
