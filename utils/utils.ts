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
