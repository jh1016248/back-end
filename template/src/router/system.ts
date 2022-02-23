/* Layout */
import Layout from '@/layout/index.vue'

export default [
    {
        path: '/system',
        component: Layout,
        redirect: '/system/user',
        meta: {
            title: '系统管理',
            icon: 'el-icon-setting',
        },
        children: [
            {
                path: 'user',
                name: 'systemUser',
                // component: () => import('@/views/system/user/index.vue'),
                component: () => import('@/views/Home.vue'),
                meta: {
                    title: '用户管理',
                },
            },
        ],
    },
]
