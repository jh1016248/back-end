import dayjs from 'dayjs'

export function formatDate(date: string | number, format = 'YYYY-MM-DD hh:mm:ss') {
    if(!date) return ''
    return dayjs(date).format(format)
}