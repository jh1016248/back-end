import request from '@/utils/request'

export const fetchList = '/sys/sysUser/user/selectByPage'
// export function fetchList(data) {
//   return request.post('/sys/sysUser/user/selectByPage', data)
// }
export function detail(id) {
    return request.get('/sys/sysUser/user/' + id)
}

export function edit(data) {
    return request.put('/sys/sysUser/user', data)
}

export function create(data) {
    return request.post('/sys/sysUser/user', data)
}

export function deletes(ids) {
    return request.delete('/sys/sysUser/user/' + ids)
}

export function resetPassword(id) {
    return request.get('/sys/sysUser/user?userId=' + id)
}
