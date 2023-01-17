import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: null,
});

export const signedInState = atom({
  key: 'signedInState',
  default: false,
});
