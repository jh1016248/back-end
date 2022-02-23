const TOKEN_NAME = 'token'

export function getToken() {
    return localStorage.getItem(TOKEN_NAME)
}

export function setToken(token: string) {
    localStorage.setItem(TOKEN_NAME, token)
}

export function clearToken() {
    localStorage.setItem(TOKEN_NAME, '')
}