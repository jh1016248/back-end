export interface IEnums {
    value: string | number
    label: string
}

export const Users = {
    type: [
        { label: '管理员', value: 1 },
        { label: '游客', value: 2 },
    ],
}

export const Common = {
    disabled: [
        { value: 1, label: '是' },
        { value: 0, label: '否' },
    ],
    result: [
        { value: 1, label: '通过' },
        { value: 0, label: '不通过' },
    ],
    enable: [
        { value: 1, label: '启用' },
        { value: 0, label: '禁用' },
    ],
    sex: [
        { value: 1, label: '男' },
        { value: 2, label: '女' },
    ],
}
