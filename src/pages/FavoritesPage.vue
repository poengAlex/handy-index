<template>
	<q-page class="container _q-pa-md full-height">
		<q-table v-if="true" id="qtable" ref="qtableref" class="" grid :rows="videosFiltered" row-key="name" hide-header
			v-model:pagination="pagination" :rows-per-page-options="rowsPerPageOptions" virtual-scroll
			@update:pagination="paginationUpdated" :loading="loading">

			<template v-slot:item="props">
				<div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
					<!-- Vue elements need a unique key to trigger a rerender -->
					<video-element @click="videoClick" :table-value="props"
						:key="(props.row as PartnerVideo).partnerVideoId">
					</video-element>
				</div>
			</template>
		</q-table>
	</q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const videos = ref<PartnerVideo[]>([]);
const rowsPerPageOptions = computed(() => {
	let initalVideos = 24;
	if ($q.screen.lg || $q.screen.xl) {
		initalVideos = initalVideos - initalVideos % 4;
		return [initalVideos, 100, 0]
	} else if ($q.screen.md) {
		initalVideos = initalVideos - initalVideos % 3;
		return [initalVideos, 100, 0]
	} else if ($q.screen.sm) {
		initalVideos = initalVideos - initalVideos % 2;
		return [initalVideos, 100, 0]
	} else if ($q.screen.xs) {
		return [initalVideos, 100, 0]
	} else {
		console.error("Cannot detect screen width");
		return [10];
	}
})
const filter = ref('')
const pagination = ref({
	page: 1,
	rowsPerPage: rowsPerPageOptions.value[0]
})

onMounted(() => {
	console.log('onMounted');
});
</script>

<style scoped>
</style>
