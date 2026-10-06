import { ref, shallowRef } from "vue";
import { getPartners } from "@/services/script-index/client";
import type { Partner } from "@/services/script-index/types";

/** The `/partners` list, by id — fetched once per visit, on first use, and
 * shared by every page that asks. Dropped if the request fails, so the next
 * ask retries. */
const byId = shallowRef<ReadonlyMap<string, Partner>>(new Map());
const status = ref<"idle" | "loading" | "ready" | "error">("idle");
let pending: Promise<void> | undefined;

function load(): Promise<void> {
  pending ??= getPartners().then(
    list => {
      byId.value = new Map(list.map(partner => [partner.partnerID, partner]));
      status.value = "ready";
    },
    () => {
      pending = undefined;
      status.value = "error";
    }
  );
  if (status.value !== "ready") status.value = "loading";
  return pending;
}

/** The partner sites as `/partners` describes them — what the catalog's
 * videos don't carry, such as each site's tags. `byId` is empty until the
 * list arrives; nothing waits on it. */
export function usePartners() {
  void load();
  return { byId, status };
}
