<template>
	<q-page class="q-pa-sm">
		<div class="text-h5">Sites</div>
		<q-list separator>
			<template v-for="(partner, index) in partners" :key="index">
				<q-item clickable @click="goToPartnerVideos(partner)">
					<q-item-section>
						<q-item-label overline>{{ partner.name }}</q-item-label>
						<q-item-label>{{ partner.description }}</q-item-label>
						<q-item-label caption v-for="(tag, index) in partner.tags" :key="index">{{ tag }}</q-item-label>
					</q-item-section>
				</q-item>
				<q-separator spaced inset />
			</template>

		</q-list>
	</q-page>
</template>

<script setup lang="ts">
// import { apiIndex, initApi } from "src/logic/api-wrapper";
import { createNotify } from "src/logic/utils";
import { Partner } from "src/_SCRIPTAPIINDEX";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useIndexStore } from "src/stores/apiIndex";
import { useSettingsStore } from "src/stores/settings";
const settings = useSettingsStore();
const apiIndex = useIndexStore();

const router = useRouter();
const partners = ref<Partner[]>([]);

function goToPartnerVideos(partner: Partner) {
	console.log('goToPartnerVideos', partner);
	router.push("/sites/" + partner.partnerId);
}

onMounted(async () => {
	console.log('onMounted - partners');
	try {
		partners.value = await apiIndex.getPartners(true);
		console.log("partners.value[0]:", partners.value[0]);
	} catch (err) { console.error(err); createNotify(err as string) }
});
</script>

<style scoped>
</style>
