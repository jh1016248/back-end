import Layout from '@/layout/index.vue'

export default [
    {
        path: '/manage/user',
        component: Layout,
        redirect: '/manage/user/index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/manage/user/index.vue'),
            },
            {
                path: 'edit/:id',
                component: () => import('@/views/manage/user/edit.vue'),
            },
        ],
    },
]
