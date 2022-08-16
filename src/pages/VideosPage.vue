<template>
	<q-page class="container ">
		<div v-if="videos.length > 0">{{ videos[0] }}</div>
		<div class="q-pa-md">
			<!-- <q-badge v-for="(value, key) in tagColors" :key="key"
				:style="{ backgroundColor: value.color, color: value.textColor }" class="q-ml-xs">
				{{ key }}</q-badge> -->
			<div class="row full-width q-pa-xs">
				<q-expansion-item filled :class="{ 'col-12': filterExpanded, 'col-8': !filterExpanded }"
					expand-separator icon="filter_alt" label="Advanced filter" v-model="filterExpanded">
					<q-card>
						<q-card-section>
							<q-input class="" filled dense debounce="50" v-model="filter" placeholder="Search"
								@update:model-value="filterAndSortVideos" clearable>
								<template v-slot:append>
									<q-icon name="search" />
								</template>
							</q-input>
							<q-select v-model="tagsSelected" :options="tagsFiltered" use-chips stack-label
								label="Filter by tags" multiple use-input @update:model-value="filterAndSortVideos"
								@filter="filterFn">
								<template v-if="tagsSelected.length !== 0" v-slot:append>
									<q-icon name="cancel" @click.stop.prevent="tagsSelected = []; filterAndSortVideos()"
										class="cursor-pointer" />
								</template>
							</q-select>
							<!-- {{ JSON.stringify(tagsSelected) }} -->
							<q-select v-model="partnersSelected" :options="partnersFiltered" option-label="name"
								use-chips stack-label label="Filter by sites" multiple use-input
								@update:model-value="filterAndSortVideos" @filter="filterFnPartners">
								<template v-if="partnersSelected.length !== 0" v-slot:append>
									<q-icon name="cancel"
										@click.stop.prevent="partnersSelected = []; filterAndSortVideos()"
										class="cursor-pointer" />
								</template>
							</q-select>
							<!-- {{ JSON.stringify(partnersSelected) }} -->
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
				<q-input class="col-4" v-if="!filterExpanded" filled dense debounce="300" v-model="filter"
					placeholder="Search">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</div>
			<q-table ref="qtableref" grid title="Videos" :rows="videosFiltered" row-key="name" hide-header
				v-model:pagination="pagination" :rows-per-page-options="rowsPerPageOptions" virtual-scroll
				@update:pagination="paginationUpdated">
				<template v-slot:top>

				</template>

				<template v-slot:item="props">
					<div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
						<q-card class="my-card">
							<!-- @error="props.row.images[0] = 'src/assets/315x300-no-image.png'" -->
							<q-responsive :ratio="16 / 9">
								<q-img :src="props.row.images[0]" fit="fill"
									@error="props.row.images[0] = 'src/assets/315x300-no-image.png'"
									placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg==">
									<div class="absolute-bottom text-subtitle1 text-center ellipsis-2-lines"
										style="height: 40%;">
										{{ props.row.title }}
										<q-tooltip>
											{{ props.row.title }}
										</q-tooltip>
										<!-- {{ props.row.images[0] }} -->
									</div>
									<!-- <template v-slot:error>
									<div class="absolute-full flex flex-center _bg-negative text-white">
										No image
									</div>
								</template> -->
								</q-img>
								<q-tooltip anchor="center middle" self="center middle" :delay="1000">
									<div style="width: 400px !important">
										<q-img :src="props.row.gifs[0]" fit="fill" width="100%"
											@error="props.row.gifs[0] = 'src/assets/315x300-no-image.png'">
										</q-img>
										<div class="row">
											<div class="text-overline col _bg-blue">{{
													partnerIdToPartnerName(props.row.partnerId)
											}}
											</div>
											<div class="col-auto text-overline  _bg-green" v-if="props.row.duration">

												{{

														dayjs.duration(props.row.duration *
															1000).format('HH') === '00' ? dayjs.duration(props.row.duration *
																1000).format('mm:ss') : dayjs.duration(props.row.duration *
																	1000).format('HH:mm:ss')
												}}
											</div>
										</div>
										<div class="text-h6 ">
											{{ props.row.title }}
										</div>
										<div class="text-subtitle1 ">
											{{ props.row.description }}
										</div>
										<div class="text-subtitle1">
											<!-- TODO: Add with dayjs when implemented -->
											{{ props.row.createdAt }}
										</div>
										<div class="row">
											<q-chip dense v-for="(tag, index) in props.row.tags" :key="index"
												class="q-ma-none q-ml-xs q-mb-xs col-auto" color="black"
												text-color="white">
												{{ tag }}</q-chip>
										</div>

									</div>
								</q-tooltip>
							</q-responsive>

							<q-card-section class="q-pa-xs q-pb-sm">
								<div class="row">
									<div class="text-overline col _bg-blue q-pl-sm">{{
											partnerIdToPartnerName(props.row.partnerId)
									}}
									</div>
									<div class="col-auto text-overline  _bg-green" v-if="props.row.duration">

										{{

												dayjs.duration(props.row.duration *
													1000).format('HH') === '00' ? dayjs.duration(props.row.duration *
														1000).format('mm:ss') : dayjs.duration(props.row.duration *
															1000).format('HH:mm:ss')
										}}
									</div>
									<q-btn dense class="col-auto" flat icon="more_vert">
										<q-menu>
											<q-list style="width: 150px">
												<q-item clickable v-close-popup>
													<q-item-section>Add to playlist</q-item-section>
												</q-item>
												<q-item clickable v-close-popup>
													<q-item-section>Favorite</q-item-section>
												</q-item>
												<q-separator />
												<q-item clickable v-close-popup>
													<q-item-section>Report</q-item-section>
												</q-item>
											</q-list>
										</q-menu>
									</q-btn>
								</div>
								<div class="column">
									<q-item-label lines="2" class="col">
										<!-- <q-badge v-for="(tag, index) in props.row.tags" :key="index"
										:style="{ backgroundColor: tagColors[tag].color, color: tagColors[tag].textColor }"
										class="q-ml-xs">
										{{ tag }}</q-badge> -->
										<q-chip v-for="(tag, index) in props.row.tags" :key="index"
											class="q-ma-none q-ml-xs q-mb-xs" color="black" text-color="white"
											size="sm">
											{{ tag }}</q-chip>
										<q-tooltip max-width="300px" anchor="center middle" self="center middle">
											<div class="row">
												<q-chip dense v-for="(tag, index) in props.row.tags" :key="index"
													class="q-ma-none q-ml-xs q-mb-xs col-auto" color="black"
													text-color="white">
													{{ tag }}</q-chip>
											</div>
										</q-tooltip>
									</q-item-label>
									<!-- <q-btn dense class="col-auto" flat icon="more_vert"></q-btn> -->
								</div>

								<div class="full-width">

								</div>
								<!-- <div class="text-subtitle2">{{ props.row.description }}</div> -->
							</q-card-section>
						</q-card>
					</div>
				</template>
			</q-table>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { QTable, useQuasar } from 'quasar';
import { PartnerVideo, Partner } from 'src/_SCRIPTAPIINDEX';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { initApi, apiIndex } from '../logic/api-wrapper'
import { createNotify } from '../logic/utils'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const qtableref = ref<QTable>();

const sortBy = ref<'createdAt' | 'updatedAt' | 'title' | 'duration'>('title');
const sortOrderDecending = ref(false);
const videos = ref<PartnerVideo[]>([]);
const videosFiltered = ref<PartnerVideo[]>([]);
const $q = useQuasar()

const partners = ref<Partner[]>([]);
const partnersFiltered = ref<Partner[]>([]);
const partnersSelected = ref<Partner[]>([]);

const tagColors = ref<any>({});
const tags = ref<string[]>([]);
const tagsFiltered = ref<string[]>([]);
const tagsSelected = ref<any[]>([]);

const filterExpanded = ref(true);

function filterFn(val, update, abort) {
	update(() => {
		console.log('searching');

		const needle = val.toLowerCase()
		tagsFiltered.value = tags.value.filter(v => v.toLowerCase().indexOf(needle) > -1)
	})
}
function filterFnPartners(val, update, abort) {
	update(() => {
		console.log('searching');

		const needle = val.toLowerCase()
		partnersFiltered.value = partners.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
	})
}

const rowsPerPageOptions = computed(() => {
	return $q.screen.gt.xs
		? $q.screen.gt.sm ? [10, 25, 100] : [10, 15]
		: [10]
})

function getItemsPerPage() {
	if ($q.screen.lt.sm) {
		return 10
	}
	if ($q.screen.lt.md) {
		return 10
	}
	return 25
}

const filter = ref('')
const pagination = ref({
	page: 1,
	rowsPerPage: getItemsPerPage()
})

function filterMethod(rows: readonly any[], terms: any, cols: readonly any[], getCellValue: (col: any, row: any) => any): (readonly any[]) {
	console.log('filterMethod', terms);
	const returnArray: any[] = [];
	rows.forEach(row => {

	});
	return returnArray;
}

function filterAndSortVideos() {
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

	console.log("sortBy:", sortBy.value, sortOrderDecending.value);

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
}

watch(() => $q.screen.name, () => {
	pagination.value.rowsPerPage = getItemsPerPage()
})

// TODO: Scroll to top of table
function paginationUpdated() {
	console.log('pagination updated');
	// console.log("qtableref.value:", qtableref.value);
	// qtableref.value?.setFullscreen();
	qtableref.value?.scrollTo(1); // TODO: This does not work
}

function tagClick(tag: string) {
	console.log('tagClick. Tag:', tag);
}

function msToVideoTime(ms: number) {
	// const sec = dayjs.
}

function getTagColor(tag: string) {
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

// TODO: This should be optimized
function partnerIdToPartnerName(partnerId: string) {
	// console.log('partnerIdToPartnerName', partnerId);
	let partnerName = "Unknown partner";
	partners.value.forEach(partner => {
		if (partner.partnerId === partnerId) {
			// console.log('MATCH!');
			partnerName = partner.name;
		}
	});
	return partnerName;
}

function tagFilterUpdated() {
	console.log('tagFilterUpdated', tagsSelected.value);
	console.log("qtableref:", qtableref.value);
	filterAndSortVideos();
	// qtableref.value?.filter(filter.value); //TODO: Does not trigger a new filter
	// HACK to trigger a filter
	// filter.value += filter.value + "_";
	// nextTick(() => {
	// 	console.log('nextTick');
	// 	nextTick(() => {
	// 		console.log('Removing extra value');

	// 		filter.value = filter.value.slice(0, -1);
	// 	});
	// });
}

onMounted(async () => {
	console.log('onMounted - videos');
	initApi();
	try {
		partners.value = await apiIndex.index.getPartners();
		console.log("partners.value:", partners.value);

		videos.value = await apiIndex.index.getIndex();
		// videos.value.reverse();
		// videos.value = await apiIndex.index.getVideos(undefined, undefined, undefined, 100);
		setTags();
		console.log("videos.value:", videos.value);
		filterAndSortVideos();
		// qtableref.value?.sort()
	} catch (err) { console.error(err); createNotify(err as string) }
});
</script>

<style lang="sass" scoped>
</style>
