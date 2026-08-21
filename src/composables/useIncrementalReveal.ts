import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref
} from "vue";

/**
 * Sentinel-driven endless scroll over an in-memory result list: `shown` is a
 * growing slice of the source, extended by `pageSize` whenever the sentinel
 * element nears the viewport. A new source list resets to the first page.
 * Render the sentinel only while `done` is false.
 */
export function useIncrementalReveal<T>(
  source: Ref<readonly T[]>,
  pageSize: number
) {
  const limit = ref(pageSize);
  const sentinel = ref<HTMLElement>();

  const shown = computed(() => source.value.slice(0, limit.value));
  const done = computed(() => limit.value >= source.value.length);

  // Length, not identity: a computed source hands back a fresh array on every
  // recompute, and some of those are in-place edits of the same rows — the
  // request board bumping a vote count, say. Resetting on those would collapse
  // a reader 900 rows deep back to the first page for a change they made
  // themselves. A narrowed filter still moves the length, which is the reset
  // that matters; re-sorting keeps the reveal and simply shows the new order.
  watch(
    () => source.value.length,
    () => {
      limit.value = pageSize;
    }
  );

  let observer: IntersectionObserver | undefined;

  onMounted(() => {
    observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          limit.value += pageSize;
        }
      },
      { rootMargin: "600px" }
    );
    watch(
      sentinel,
      (el, _old, onCleanup) => {
        if (el && observer) {
          observer.observe(el);
          onCleanup(() => observer?.unobserve(el));
        }
      },
      { immediate: true }
    );
    // The observer only notifies on intersection *changes*, so when a reveal
    // is too short to push the sentinel out of the rootMargin zone it would
    // never fire again. Re-observing queues a fresh notification, so the
    // reveal keeps going until the sentinel actually leaves the zone.
    watch(
      limit,
      () => {
        const el = sentinel.value;
        if (el && observer) {
          observer.unobserve(el);
          observer.observe(el);
        }
      },
      { flush: "post" }
    );
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  return { shown, done, sentinel };
}
