import "server-only";

import { unstable_cache } from "next/cache";

export type CachePolicy = {
  key: string[];
  tags: string[];
  draft: boolean;
  revalidate?: number | false;
};

export async function cachedRead<T>(
  policy: CachePolicy,
  read: () => Promise<T>,
): Promise<T> {
  if (policy.draft) return read();
  return unstable_cache(read, policy.key, {
    tags: policy.tags,
    revalidate: policy.revalidate ?? false,
  })();
}
