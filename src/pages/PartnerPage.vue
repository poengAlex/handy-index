<template>
	<q-banner class="bg-warning text-black">
		<template v-slot:avatar>
			<q-icon name="warning" color="black" />
		</template>
		This page is not completed. More detailes to come in future updates
	</q-banner>
	<template v-if="partner !== undefined">
		<div class="text-h1">{{ partner.name }}</div>
		<div class="text-subtitle1">{{ partner.description }}</div>
		<q-btn color="accent" @click="goToVideos">Show videos</q-btn>
	</template>
	<template v-else>
		ERROR
	</template>

</template>

<script setup lang="ts">
import { useIndexStore } from "src/stores/apiIndex";
import { useSettingsStore } from "src/stores/settings";
import { Partner } from "src/_SCRIPTAPIINDEX";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const settings = useSettingsStore();
const apiIndex = useIndexStore();
const partner = ref<Partner>();
const route = useRoute();
const router = useRouter();

function goToVideos() {
	router.push({
		path: "/videos",
		query: {
			partner: JSON.stringify(partner.value)
		}
	})
}

onMounted(async () => {
	console.log('onMounted - partner');
	const partnerId = route.params.partnerId;
	console.log("partnerId:", partnerId);

	const partners = await apiIndex.getPartners(true);
	partners.forEach(_partner => {
		if (_partner.partnerId === partnerId) {
			partner.value = _partner;
		}
	});
});
</script>

<style scoped>
</style>
