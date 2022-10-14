<template>
	<div class="row">
		<div class="col-12 q-pa-xs">
			<q-input class="" filled dense debounce="500" v-model="filter" placeholder="Search"
				@update:model-value="page = 0;getData()" clearable>
				<template v-slot:append>
					<q-icon name="search" />
				</template>
			</q-input>
			<!-- <small>Showing {{performers.length}} of 1300</small> -->
		</div>
		<template v-for="(perfomer,index) in performers" :key="perfomer.performerId">
			<div class="col-12 col-sm-6 col-md-4 col-lg-2 q-pa-xs cursor-pointer" @click="goToPerformer(perfomer)">
				<q-responsive :ratio="4/3">
					<q-img :src="settings.nsfw ? perfomer.avatar : 'https://via.placeholder.com/315x300.png?text=NSFW'"
						fit="contain"
						@error="performer.avatar = 'https://via.placeholder.com/315x300.png?text=No image'"
						referrerpolicy="no-referrer">
						<div class="absolute-bottom" style="height: 40%;padding: 0px;">
							<div class="row items-center justify-evenly full-height full-width">
								<div class="ellipsis-2-lines text-picture text-subtitle1 q-pl-lg q-pr-lg">
									{{ perfomer.name }}
								</div>
							</div>

							<!-- <q-tooltip>
						{{ video.title }}
					</q-tooltip> -->
						</div>
					</q-img>
				</q-responsive>

			</div>
		</template>
		<div v-if="!(page === 0 && performers.length !== MAX_TAKE)" class="col-12 q-pa-xs q-gutter-xs row">
			<div class="col-auto">
				Page {{page+1}}
			</div>
			<div class="col text-right">

				<q-btn :disable="page===0" @click="page--;getData()" :loading="loading">Back</q-btn>
				<q-btn :disable="MAX_TAKE !== performers.length" @click="page++;getData()" :loading="loading">Next
				</q-btn>
			</div>
		</div>
		<q-inner-loading :showing="loading">
			<q-spinner-gears size="50px" color="primary" />
		</q-inner-loading>
	</div>
</template>

<script setup lang="ts">
import { createNotify, randomIntFromInterval } from "src/logic/utils";
import { useIndexStore } from "src/stores/apiIndex";
import { useSettingsStore } from "src/stores/settings";
import { Performer } from "src/_SCRIPTAPIINDEX";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const MAX_TAKE = 48;
const NR_OF_PERFORMERS = 1000;
const settings = useSettingsStore()
const apiIndex = useIndexStore();
const performers = ref<Performer[]>([]);
const performersFiltered = ref<Performer[]>([]);
const loading = ref(true);
const filter = ref("");
const page = ref(0)
const router = useRouter();

function goToPerformer(performer: Performer) {
	router.push({
		path: "/videos",
		query: {
			performerId: performer.performerId,
			performerName: performer.name
		}
	})
}

// function filterAndSortPerformers() {
// 	console.log('Filtering');

// 	performersFiltered.value.length = 0;
// 	performers.value.forEach(performer => {
// 		if (filter.value === "") {
// 			performersFiltered.value.push(performer);
// 		} else if (performer.name.toLocaleLowerCase().includes(filter.value.toLocaleLowerCase())) {
// 			performersFiltered.value.push(performer);
// 		}
// 	});
// }

async function getData() {
	loading.value = true;
	try {
		if (filter.value === "" || filter.value === null) {
			console.log('empty filter - getting random performers');
			const maxNrOFBlocks = Math.floor(NR_OF_PERFORMERS / MAX_TAKE);
			performers.value = await apiIndex.getApi().index.getPerformers(undefined, undefined, undefined, MAX_TAKE, randomIntFromInterval(0, maxNrOFBlocks) * MAX_TAKE)
		} else {
			performers.value = await apiIndex.getApi().index.getPerformers(filter.value, undefined, undefined, MAX_TAKE, page.value * MAX_TAKE)
		}
		if (performers.value.length > 0) {
			console.log('Perfomer:', JSON.parse(JSON.stringify(performers.value[0])));
		}
	} catch (err) {
		console.error(err);
		createNotify(err as string)
	}
	loading.value = false;
}

onMounted(async () => {
	console.log('onMounted');
	getData();
});
</script>

<style scoped>

</style>
