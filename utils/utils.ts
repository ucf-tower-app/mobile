import Filter from 'bad-words';

/**
 * A debounce session provides the `trigger` method which
 * will wait until `cooldown` milliseconds have passed
 * without a trigger before applying the callback
 */
export class DebounceSession {
  timeoutId?: ReturnType<typeof setTimeout>;

  constructor(public cooldown: number) {}

  trigger(callback: () => void) {
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(callback, this.cooldown);
  }
}

const suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
export function formatOrdinals(n: number) {
  return `${n}${suffixes[n % 10]}`;
}

export const wordFilter = new Filter();
