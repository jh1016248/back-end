import request from '@/utils/request'

export function fetchList(data) {
  return request.post('/sys/sysMenu/menu/selectByPage', data)
}

export function detail(id) {
    return request.get('/sys/sysMenu/menu/' + id)
}

export function create(data) {
  return request.post('/sys/sysMenu/menu', data)
}
export function edit(data) {
  return request.put('/sys/sysMenu/menu', data)
}

export function deletes(ids) {
  return request.delete('/sys/sysMenu/menu/' + ids)
}


export function tree(data) {
  return request.post('/sys/sysMenu/menu/tree', data)
}
