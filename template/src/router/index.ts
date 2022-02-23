import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import userRouter from './manage/user'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/',
        name: 'layout',
        redirect: '/home',
        component: Layout,
        children: [
            {
                path: 'home',
                component: () => import('@/views/Home.vue'),
            },
        ],
    },
    ...userRouter,
    /*NEW_ROUTER_INSERT*/
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
