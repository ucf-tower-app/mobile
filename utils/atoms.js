import { atom } from 'recoil'

export const userState = atom({
    key: 'userState',
    default: {}
})

export const loggedInState = atom({
    key: 'loggedInState',
    default: false
})
