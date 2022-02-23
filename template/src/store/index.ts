import { setToken } from '@/utils/auth'
import { createStore } from 'vuex'
// import { ElMessage } from 'element-plus'
// import request from '@/utils/request'
// import users from '@/apis/user'

export interface GlobalDataProps {
    showSideBar: boolean
    username: string
    headimgurl: string
}

export default createStore({
    state: {
        headimgurl: '',
        showSideBar: true,
        username: '',
    },
    mutations: {
        CHANGE_SIDE_BAR(state, visible) {
            state.showSideBar = visible
        },
    },
    actions: {
        login({ state }, data) {
            return new Promise((resolve, reject) => {
                setToken('token')
                resolve(true)
                // request.post(apis.login, data).then((res: any) => {
                //     if (res.success) {
                //         localStorage.token = res.data.pctoken
                //         state.username = res.data.nickname
                //         state.headimgurl = res.data.headimgurl
                //         resolve(true)
                //     } else {
                //         ElMessage.error({ message: res.message })
                //         reject()
                //     }
                // })
            })
        },
        getInfo({ state }) {
            return Promise.resolve(true)
            // return new Promise((resolve) => {
            //     request.post(apis.getUserByToken).then((res: any) => {
            //         state.username = res.data.nickname
            //         state.headimgurl = res.data.headimgurl
            //         resolve(true)
            //     })
            // })
        },
    },
    modules: {},
})
