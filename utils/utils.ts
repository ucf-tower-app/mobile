import Filter from 'bad-words';
import { Post } from '../xplat/types';

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

/**
 * Takes in a list of posts and spits out the posts
 * that should be viewed by this client.
 */
export const filterPosts = async (posts: Post[]) => {
  // Get the data, so that `exists` is properly mapped for cache-invalidated data
  await Promise.all(posts.map((post) => post.getData()));

  // Filter out the bad data
  const shouldBeOmittedResults = await Promise.all(
    posts.map((post) => !post.exists || post.checkShouldBeHidden())
  );
  posts = posts.filter((_, index) => !shouldBeOmittedResults[index]);

  return posts;
};
