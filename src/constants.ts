export const JACKPOT = '- 100%';
export const LOW_DISCOUNT = '- 25%';
export const HIGH_DISCOUNT = '- 50%';
export const GOODIE = 'GOODIE';

export type Prize = typeof JACKPOT | typeof LOW_DISCOUNT | typeof HIGH_DISCOUNT | typeof GOODIE;