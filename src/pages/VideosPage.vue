<template>

	<q-inner-loading :showing="loading">
		<q-spinner size="50px" color="black" />
	</q-inner-loading>
	<!-- <div v-if="videos.length > 0">{{ videos[0] }}</div> -->
	<div class="text-h4" v-if="fav">
		<q-icon name="favorites"></q-icon>Favorites
	</div>
	<!-- Search and filter -->
	<div class="row full-width q-pt-lg q-pr-xs">
		<q-expansion-item filled class="col-12" :class="{ 'col-sm-12': filterExpanded, 'col-sm-8': !filterExpanded }"
			expand-separator icon="filter_alt" label="Advanced filter" v-model="filterExpanded">
			<q-card>
				<q-card-section>
					<q-input class="" filled dense debounce="250" v-model="filter" placeholder="Search"
						@update:model-value="filterAndSortVideos" clearable>
						<template v-slot:append>
							<q-icon name="search" />
						</template>
					</q-input>
					<q-select v-model="tagsSelected" :options="tagsFiltered" use-chips stack-label
						label="Filter by tags" multiple use-input @update:model-value="filterAndSortVideos"
						@filter="filterFnTags">
						<template v-if="tagsSelected.length !== 0" v-slot:append>
							<q-icon name="cancel" @click.stop.prevent="tagsSelected = []; filterAndSortVideos()"
								class="cursor-pointer" />
						</template>
					</q-select>
					<q-select v-model="partnersSelected" :options="partnersFiltered" option-label="name" use-chips
						stack-label label="Filter by sites" multiple use-input @update:model-value="filterAndSortVideos"
						@filter="filterFnPartners">
						<template v-if="partnersSelected.length !== 0" v-slot:append>
							<q-icon name="cancel" @click.stop.prevent="partnersSelected = []; filterAndSortVideos()"
								class="cursor-pointer" />
						</template>
					</q-select>
					<div class="q-gutter-sm">
						<q-icon name="sort"></q-icon>
						<q-btn flat dense :icon="sortOrderDecending ? 'arrow_downward' : 'arrow_upward'"
							@click="sortOrderDecending = !sortOrderDecending; filterAndSortVideos()">
						</q-btn>
						<q-radio v-model="sortBy" val="createdAt" label="Added time"
							@update:model-value="filterAndSortVideos" />
						<q-radio v-model="sortBy" val="updatedAt" label="Updated time"
							@update:model-value="filterAndSortVideos" />
						<q-radio v-model="sortBy" val="duration" label="Duration"
							@update:model-value="filterAndSortVideos" />
						<q-radio v-model="sortBy" val="title" label="Video name"
							@update:model-value="filterAndSortVideos" />
					</div>
				</q-card-section>
			</q-card>
		</q-expansion-item>
		<q-input class="col-4 gt-xs" v-if="!filterExpanded" filled dense debounce="250" v-model="filter"
			placeholder="Search" v-on:update:model-value="filterAndSortVideos">
			<template v-slot:append>
				<q-icon name="search" />
			</template>
		</q-input>
	</div>
	<!-- END Search and filter -->

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
</template>

<script setup lang="ts">
import { QTable, useQuasar } from 'quasar';
import { PartnerVideo, Partner } from 'src/_SCRIPTAPIINDEX';
import { computed, onMounted, ref, watch } from 'vue';
// import { initApi, apiIndex } from '../logic/api-wrapper'
import { createNotify } from '../logic/utils'
import VideoElement from 'src/components/VideoElement.vue';
import { useRoute, useRouter } from 'vue-router';
import { useSettingsStore } from '../stores/settings'
import { useIndexStore } from 'src/stores/apiIndex';
const settings = useSettingsStore()
const apiIndex = useIndexStore();

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const qtableref = ref<QTable>();
const sortBy = ref<'createdAt' | 'updatedAt' | 'title' | 'duration'>('title');
const sortOrderDecending = ref(false);
const videos = ref<PartnerVideo[]>([]);
const videosFiltered = ref<PartnerVideo[]>([]);
const $q = useQuasar()
const fav = ref(false);

// const partners = ref<Partner[]>([]);
const partnersFiltered = ref<Partner[]>([]);
const partnersSelected = ref<Partner[]>([]);

const tagColors = ref<any>({});
const tags = ref<string[]>([]);
const tagsFiltered = ref<string[]>([]);
const tagsSelected = ref<any[]>([]);

const filterExpanded = ref(false);
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

function filterFnTags(val: any, update: any, abort: () => void) {
	update(() => {
		console.log('searching - tags');
		const needle = val.toLowerCase()
		tagsFiltered.value = tags.value.filter(v => v.toLowerCase().indexOf(needle) > -1)
	})
}

function filterFnPartners(val: any, update: any, abort: () => void) {
	update(async () => {
		console.log('searching - partners');

		const needle = val.toLowerCase()
		partnersFiltered.value = apiIndex.partners.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
	})
}

function videoClick(video: PartnerVideo) {
	console.log('videoClick', video);
	router.push({
		path: "/videos/" + video.partnerVideoId
	})
}

// function getItemsPerPage() {
// 	const initalVideos = rowsPerPageOptions.value[0];
// 	if ($q.screen.lg || $q.screen.xl) {
// 		return initalVideos - initalVideos % 4;
// 	} else if ($q.screen.md) {
// 		return initalVideos - initalVideos % 3;
// 	} else if ($q.screen.sm) {
// 		return initalVideos - initalVideos % 2;
// 	} else if ($q.screen.xs) {
// 		return initalVideos
// 	} else {
// 		console.error("Cannot detect screen width");
// 		return initalVideos;
// 	}
// }

function filterAndSortVideos() {
	console.log('filterAndSortVideos');

	let tempVideos: PartnerVideo[] = [];
	// videos.value.forEach(video => {
	// 	tempVideos.push(video);
	// });
	videos.value.forEach(video => {
		const searchText = filter.value === null ? "" : filter.value.toLowerCase(); // clearable sets value to null
		if (searchText !== "") {
			if (video.title?.toLowerCase().includes(searchText)) {
				tempVideos.push(video)
			}
		} else {
			tempVideos.push(video)
		}
	});

	if (tagsSelected.value.length > 0) {
		const tempVideosNested: PartnerVideo[] = []
		tempVideos.forEach(video => {
			let tagsMatch = true;
			tagsSelected.value.forEach(tagSelected => {
				let tagMatch = false;
				video.tags!.forEach(tag => {
					if (tagSelected === tag) {
						// console.log('MATCH tag', video, tag);
						tagMatch = true;
					}
				});
				tagsMatch = tagsMatch && tagMatch
			});
			if (tagsMatch) {
				tempVideosNested.push(video);
			}
		});
		tempVideos = tempVideosNested;
	}

	if (partnersSelected.value.length > 0) {
		const tempVideosNested: PartnerVideo[] = []
		tempVideos.forEach(video => {
			let partnerMatch = false;
			partnersSelected.value.forEach(parnterSelcted => {
				if (parnterSelcted.partnerId === video.partnerId) {
					partnerMatch = true;
				}
			});
			if (partnerMatch) {
				tempVideosNested.push(video);
			}
		});
		tempVideos = tempVideosNested;
	}

	videosFiltered.value.length = 0;
	tempVideos.forEach(video => {
		videosFiltered.value.push(video);
	});

	// console.log("sortBy:", sortBy.value, sortOrderDecending.value);

	function compareDesending(a: any, b: any) {
		if (a[sortBy.value] < b[sortBy.value]) {
			return 1;
		}
		if (a[sortBy.value] > b[sortBy.value]) {
			return -1;
		}
		return 0;
	}
	function compareAcsending(a: any, b: any) {
		if (a[sortBy.value] < b[sortBy.value]) {
			return -1;
		}
		if (a[sortBy.value] > b[sortBy.value]) {
			return 1;
		}
		return 0;
	}
	if (sortOrderDecending.value) {
		videosFiltered.value.sort(compareDesending);
	} else {
		videosFiltered.value.sort(compareAcsending);
	}
	console.log("videosFiltered.value:", videosFiltered.value);
}

watch(() => $q.screen.name, () => {
	pagination.value.rowsPerPage = rowsPerPageOptions.value[0]
})

// TODO: Scroll to top of table
function paginationUpdated() {
	console.log('pagination updated');
	// console.log("qtableref.value:", qtableref.value);
	// qtableref.value?.setFullscreen();
	// qtableref.value?.scrollTo(1); // TODO: This does not work
	const qtable = document.getElementById("qtable");
	if (qtable !== null) {
		qtable.scrollTop = 0;
	} else {
		console.log('qtable is null');
	}
}

function setTags() {
	videos.value.forEach(video => {
		if (video.tags) {
			video.tags.forEach(tag => {
				if (!Object.hasOwn(tagColors.value, tag)) {
					// tags.value.push(tag);
					// RGB
					// const value = Math.floor(Math.random() * 16777215);
					// const inverse = 16777215 - value;
					// tagColors.value[tag] = {
					// 	color: "#" + value.toString(16),
					// 	textColor: "#" + inverse.toString(16)
					// }
					// HSV
					const hue = Math.floor(Math.random() * 360);
					const hueInvert = 360 - hue;
					const sat = 70;
					const light = 50;
					const diff = 25;
					tagColors.value[tag] = {
						color: `hsl(${hue},${sat}%,${light - diff}%)`,
						textColor: `hsl(${hueInvert},${sat}%,${light + diff}%)`
					}
				}
			});
		}
	});
	tags.value.length = 0;
	for (const key in tagColors.value) {
		if (Object.prototype.hasOwnProperty.call(tagColors.value, key)) {
			const tag = tagColors.value[key];
			tags.value.push(key);
		}
	}
	tags.value.sort();
	console.log("tagColors.value:", tagColors.value);
}

function parseQuaryParams() {
	// tagsSelected.value.length = 0;
	// partnersSelected.value.length = 0;
	// filterExpanded.value = false;
	if (route.query !== undefined) {
		if (route.query.tag) {
			console.log("route.query.tag:", route.query.tag);
			filterExpanded.value = true;
			tagsSelected.value.push(route.query.tag)
			filterAndSortVideos();
		}
		if (route.query.partner) {
			filterExpanded.value = true;
			const partner = JSON.parse(route.query.partner as string) as Partner;
			partnersSelected.value.push(partner)
			filterAndSortVideos();
		}
	}
}

async function setVideos() {
	try {
		apiIndex.getPartners();
		if (route.query.fav) {
			loading.value = false;
			fav.value = true;
			videos.value = settings.favorites;
			setTags();
			console.log("videos.value:", videos.value);
			filterAndSortVideos();
		} else {
			fav.value = false;
			apiIndex.getIndex().then(_videos => {
				loading.value = false;
				videos.value = _videos
				// videos.value.reverse();
				// videos.value = await apiIndex.index.getVideos(undefined, undefined, undefined, 100);
				setTags();
				console.log("videos.value:", videos.value);
				filterAndSortVideos();
				// qtableref.value?.sort()
			}).catch((err: any) => {
				console.error(err);
				createNotify(err as string)
			});
		}
	} catch (err) { console.error(err); createNotify(err as string) }
}

router.afterEach(async (to, from) => {
	console.log('ROUTING');
	await setVideos()
	parseQuaryParams()
})

onMounted(async () => {
	console.log('onMounted - videos');

	await setVideos()
	parseQuaryParams()
});
</script>

<style lang="sass" scoped>
</style>
