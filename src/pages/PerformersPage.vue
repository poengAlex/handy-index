<template>
	<div class="row">
		<q-inner-loading :showing="loading">
			<q-spinner-gears size="50px" color="primary" />
		</q-inner-loading>
	</div>
</template>

<script setup lang="ts">
import { createNotify } from "src/logic/utils";
import { useIndexStore } from "src/stores/apiIndex";
import { useSettingsStore } from "src/stores/settings";
import { Performer } from "src/_SCRIPTAPIINDEX";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const settings = useSettingsStore()
const apiIndex = useIndexStore();
const performers = ref<Performer[]>([]);
const performersFiltered = ref<Performer[]>([]);
const loading = ref(true);
const router = useRouter();

function goToPerformer(performer: Performer) {
	router.push({
		path: "/videos",
		query: {
			performer: performer.performerId
		}
	})
}

onMounted(async () => {
	console.log('onMounted');
	try {
		performers.value = await apiIndex.getApi().index.getPerformers();
	} catch (err) {
		console.error(err);
		createNotify(err as string)
	}

	loading.value = false;
});
</script>

<style scoped>

</style>
