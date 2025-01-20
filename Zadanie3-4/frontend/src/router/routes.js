import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import {useAuthStore} from "@/stores/auth.js";
import LoginComponent from "@/components/LoginComponent.vue";
import RegisterComponent from "@/components/RegisterComponent.vue";

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
        }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
