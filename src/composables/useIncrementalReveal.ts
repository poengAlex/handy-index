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

  watch(source, () => {
    limit.value = pageSize;
  });

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
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  return { shown, done, sentinel };
}
