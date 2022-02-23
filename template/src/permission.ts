import router from './router'

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next()
    } else {
        const token = localStorage.token
        if (!token) {
            return next({ path: '/login' })
        } else {
            return next()
        }
    }
})