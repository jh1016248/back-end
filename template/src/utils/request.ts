import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import router from '@/router/index'
const service = axios.create({
    timeout: 60 * 1000, // request timeout
    headers: {
        'Content-Type': 'application/json',
    },
})

interface IResp<T> {
    success: boolean,
    data?: T,
    message?: string
}
type Methods = 'get' | 'post' | 'delete' | 'put'
type Options = {
    loading?: boolean
    params?: any
    headers?: any
    showErr?: boolean
}
const defaultOptions = {
    loading: false,
    params: {},
    showErr: true
}
export function getHeaders() {
    return {
        token: localStorage.token || '',
        plateform: 'pc',
    }
}
const requestFn = function <T>(
    method: Methods,
    url: string,
    data?: any,
    options?: Options
) {
    const mergeOptions = Object.assign(
        JSON.parse(JSON.stringify(defaultOptions)),
        options
    )
    let loading: any = null
    if (mergeOptions.loading) {
        loading = ElLoading.service()
    }
    return new Promise<T>((resolve, reject) => {
        service
            .request({
                method,
                url,
                params: mergeOptions.params,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    ...getHeaders(),
                    ...mergeOptions.headers,
                },
            })
            .then((res) => {
                if (res.data.code == 403) {
                    return router.push('/login')
                }
                if(!res.data.success && mergeOptions.showErr) {
                    ElMessage.warning(res.data.message)
                }
                resolve(res.data as T)
            })
            .catch((e) => {
                reject(e)
            })
            .finally(() => {
                loading && loading.close()
            })
    })
}
const request = {
    get: <T>(url: string, data?: any, options?: Options): Promise<IResp<T>> =>
        requestFn<IResp<T>>('get', url, data, options),
    post: <T>(url: string, data?: any, options?: Options): Promise<IResp<T>> =>
        requestFn<IResp<T>>('post', url, data, options),
    delete: <T>(url: string, data?: any, options?: Options): Promise<IResp<T>> =>
        requestFn<IResp<T>>('delete', url, data, options),
    put: <T>(url: string, data?: any, options?: Options): Promise<IResp<T>> =>
        requestFn<IResp<T>>('put', url, data, options),
}
export default request
