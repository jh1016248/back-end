import request from '@/utils/request'

export function fetchList(data) {
  return request.post('/sys/sysDict/dict/selectByPage', data)
}

export function detail(id) {
    return request.get('/sys/sysDict/dict/' + id)
}

export function create(data) {
  return request.post('/sys/sysDict/dict', data)
}

export function edit(data) {
  return request.put('/sys/sysDict/dict', data)
}

export function deletes(ids) {
    return request.delete('/sys/sysDict/dict/' + ids)
}
