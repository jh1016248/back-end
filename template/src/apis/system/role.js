import request from '@/utils/request'

export function fetchList(data) {
    return request.post('/sys/sysRole/role/selectByPage', data)
}

export function detail(id) {
    return request.get('/sys/sysRole/role/' + id)
}

export function create(data) {
    return request.post('/sys/sysRole/role', data)
}
export function edit(data) {
    return request.put('/sys/sysRole/role', data)
}

export function deletes(ids) {
    return request.delete('/sys/sysRole/role/' + ids)
}

export function getMenu(id) {
    return request.get(`/sys/sysRole/role/${id}/menu`)
}
export function setMenu(data) {
    return request.post('/sys/sysRole/role/menu', data)
}
