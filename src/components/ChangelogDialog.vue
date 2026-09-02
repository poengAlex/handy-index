<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal
      :title="$t('about.changelog.title')"
      closable
      class="changelog-dialog"
    >
      <p class="text-body-sm changelog-dialog__lead">
        {{ $t("about.changelog.lead") }}
      </p>
      <p
        v-if="locale !== 'en-US'"
        class="text-body-sm changelog-dialog__notice"
      >
        {{ $t("about.changelog.englishOnly") }}
      </p>

      <div v-if="status === 'loading'" class="changelog-dialog__loading">
        <HandyLoader />
      </div>

      <HEmptyState
        v-else-if="status === 'error'"
        icon="cloud_off"
        :title="$t('about.changelog.errorTitle')"
        :body="$t('about.changelog.errorBody')"
        :action-label="$t('common.action.retry')"
        @action="load"
      />

      <div v-else class="changelog-dialog__releases">
        <section
          v-for="release in releases"
          :key="release.version"
          class="changelog-dialog__release"
        >
          <header class="changelog-dialog__head">
            <h4 class="text-h6 changelog-dialog__version">
              {{ release.version }}
            </h4>
            <span v-if="release.date" class="text-caption">
              {{ release.date }}
            </span>
          </header>

          <template v-for="(block, index) in grouped(release)" :key="index">
            <h5
              v-if="block.kind === 'group'"
              class="text-body-sm changelog-dialog__group"
            >
              {{ block.text }}
            </h5>
            <p
              v-else-if="block.kind === 'note'"
              class="text-body-sm changelog-dialog__note"
            >
              {{ block.text }}
            </p>
            <ul v-else class="text-body-sm changelog-dialog__list">
              <li v-for="(item, i) in block.items" :key="i">{{ item }}</li>
            </ul>
          </template>
        </section>
      </div>

      <template #actions>
        <HBtn v-close-popup :label="$t('common.action.done')" />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// The list of changes visitors get from the help page, read out of
// public/CHANGELOG.md. Fetched the first time the dialog is opened rather
// than with the page: most visits never ask for it.
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { HBtn, HEmptyState, HModal, HandyLoader } from "@/components/handy";
import { type ChangelogRelease, fetchChangelog } from "@/services/changelog";

const props = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const { locale } = useI18n();

const status = ref<"idle" | "loading" | "ready" | "error">("idle");
const releases = ref<ChangelogRelease[]>([]);

async function load() {
  status.value = "loading";
  try {
    releases.value = await fetchChangelog();
    status.value = "ready";
  } catch {
    status.value = "error";
  }
}

// opening is the trigger; a second opening reuses what the first one got,
// but a failed attempt is retried rather than left as an error forever
watch(
  () => props.modelValue,
  open => {
    if (open && status.value !== "ready" && status.value !== "loading") {
      void load();
    }
  }
);

/** Consecutive changes belong to one bullet list — the file writes them as
 * separate lines, the reader should see a list. */
type Rendered =
  | { kind: "group"; text: string }
  | { kind: "note"; text: string }
  | { kind: "list"; items: string[] };

function grouped(release: ChangelogRelease): Rendered[] {
  const out: Rendered[] = [];
  for (const block of release.blocks) {
    if (block.kind === "change") {
      const last = out.at(-1);
      if (last?.kind === "list") last.items.push(block.text);
      else out.push({ kind: "list", items: [block.text] });
      continue;
    }
    out.push(block);
  }
  return out;
}
</script>

<style scoped lang="scss">
.changelog-dialog__lead {
  color: var(--color-text-secondary);
  margin: 0;
}

.changelog-dialog__notice {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

.changelog-dialog__loading {
  display: flex;
  justify-content: center;
  padding: var(--space-xl) 0;
}

.changelog-dialog__releases {
  margin-top: var(--space-lg);
}

.changelog-dialog__release + .changelog-dialog__release {
  margin-top: var(--space-xl);
}

// version and date on one baseline: the number is the heading, the date is
// the quiet half beside it
.changelog-dialog__head {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  color: var(--color-text-tertiary);
}

.changelog-dialog__version {
  margin: 0;
  color: var(--color-text-primary);
}

.changelog-dialog__note {
  color: var(--color-text-secondary);
  margin: var(--space-sm) 0 0;
}

.changelog-dialog__group {
  margin: var(--space-md) 0 var(--space-xs);
  color: var(--color-text-primary);
  font-weight: 600;
}

.changelog-dialog__list {
  color: var(--color-text-secondary);
  margin: var(--space-xs) 0 0;
  padding-left: var(--space-lg);

  li {
    margin-bottom: var(--space-xs);
  }
}
</style>
