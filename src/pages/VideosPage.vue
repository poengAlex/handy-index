<template>
	<div id="topVideosContainer" class="column _hide-scrollbar" style="">
		<q-inner-loading :showing="loading">
			<q-spinner size="50px" color="black" />
		</q-inner-loading>
		<div class="col-auto">
			<!-- <div v-if="videos.length > 0">{{ videos[0] }}</div> -->
			<div v-if="fav" class="text-h4 row">
				<q-icon class="col-auto" name="favorites"></q-icon>
				<div class="col-auto">Favorites</div>
			</div>
			<!-- Search and filter -->
			<div class="row full-width q-pt-sm q-pr-xs">
				<q-expansion-item filled class="col-12"
					:class="{ 'col-sm-12': filterExpanded, 'col-sm-8': !filterExpanded }" expand-separator
					icon="filter_alt"
					:label="'Advanced filter - showing ' + videosFiltered.length + ' of ' + videos.length + ' videos'"
					v-model="filterExpanded">
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
							<q-select v-model="partnersSelected" :options="partnersFiltered" option-label="name"
								use-chips stack-label label="Filter by sites" multiple use-input
								@update:model-value="filterAndSortVideos" @filter="filterFnPartners">
								<template v-if="partnersSelected.length !== 0" v-slot:append>
									<q-icon name="cancel"
										@click.stop.prevent="partnersSelected = []; filterAndSortVideos()"
										class="cursor-pointer" />
								</template>
							</q-select>
							<q-select v-model="performersSelected" :options="performersFiltered" option-label="name"
								use-chips stack-label label="Filter by performers" multiple use-input
								@update:model-value="filterAndSortVideos" @filter="filterFnPerformers">
								<template v-if="performersSelected.length !== 0" v-slot:append>
									<q-icon name="cancel"
										@click.stop.prevent="performersSelected = []; filterAndSortVideos()"
										class="cursor-pointer" />
								</template>
							</q-select>
							<div class="q-gutter-sm">
								<q-icon name="sort"></q-icon>
								<q-btn flat dense :icon="sortOrderDecending ? 'arrow_downward' : 'arrow_upward'"
									@click="sortOrderDecending = !sortOrderDecending; filterAndSortVideos()">
								</q-btn>
								<q-radio v-model="sortBy" val="publishedAt" label="Published time"
									@update:model-value="filterAndSortVideos" />
								<q-radio v-model="sortBy" val="updatedAt" label="Updated time"
									@update:model-value="filterAndSortVideos" />
								<q-radio v-model="sortBy" val="duration" label="Duration"
									@update:model-value="filterAndSortVideos" />
								<q-radio v-model="sortBy" val="title" label="Video name"
									@update:model-value="filterAndSortVideos" />
								<q-toggle v-model="premiumVideoFilter" @update:model-value="filterAndSortVideos">Premium
									videos
									<q-tooltip>
										Videos that are behind a paywall
									</q-tooltip>
								</q-toggle>
								<q-toggle v-model="premiumScriptFilter" @update:model-value="filterAndSortVideos">
									Premium
									scripts
									<q-tooltip>
										Scripts that are behind a paywall
									</q-tooltip>
								</q-toggle>
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
		</div>
		<div class="col _hide-scrollbar" style="max-height: 100%;overflow: auto;">
			<!-- {{arrivedState}} -->
			<q-table v-if="true" id="qtable" ref="qtableref" class="hide-scrollbar" grid :rows="videosFiltered"
				row-key="name" hide-header v-model:pagination="pagination" :rows-per-page-options="rowsPerPageOptions"
				virtual-scroll @update:pagination="paginationUpdated" :loading="loading" v-scroll="onScroll"
				style="max-height: 100%;overflow: auto;">

				<template v-slot:item="props">
					<div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
						<!-- Vue elements need a unique key to trigger a rerender -->
						<video-element @click="videoClick((props.row as PartnerVideo),false)"
							@click-right="videoClick((props.row as PartnerVideo),true)" :table-value="props"
							:key="(props.row as PartnerVideo).partnerVideoId">
						</video-element>
					</div>
				</template>
			</q-table>
		</div>
	</div>

</template>

<script setup lang="ts">
import { QTable, useQuasar } from 'quasar';
import { PartnerVideo, Partner, Performer } from 'src/_SCRIPTAPIINDEX';
import { computed, onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue';
// import { initApi, apiIndex } from '../logic/api-wrapper'
import { createNotify, nonReactiveObject } from '../logic/utils'
import VideoElement from 'src/components/VideoElement.vue';
import { useRoute, useRouter } from 'vue-router';
import { useSettingsStore } from '../stores/settings'
import { useIndexStore } from 'src/stores/apiIndex';
import { useScroll } from '@vueuse/core'
import { vScroll } from '@vueuse/components'
const settings = useSettingsStore()
const apiIndex = useIndexStore();

const DEFAULT_VIDEOS_PER_PAGE = 36;
const route = useRoute();
const router = useRouter();
const loading = ref(true);
const qtableref = ref<QTable>();
const sortBy = ref<'publishedAt' | 'updatedAt' | 'title' | 'duration'>('publishedAt');
const sortOrderDecending = ref(true);
const videos = ref<PartnerVideo[]>([]);
const videosFiltered = ref<PartnerVideo[]>([]);
const $q = useQuasar()
const fav = ref(false);
let innerTable: HTMLDivElement;
// const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, arrivedState, directions } = useScroll(qtableref as unknown as HTMLElement, {
	offset: { top: 0, bottom: 400, right: 0, left: 0 }
})

// const partners = ref<Partner[]>([]);
const partnersFiltered = ref<Partner[]>([]);
const partnersSelected = ref<Partner[]>([]);

const performers = ref<Performer[]>([]);
const performersFiltered = ref<Performer[]>([]);
const performersSelected = ref<Performer[]>([]);

const tagColors = ref<any>({});
const tags = ref<string[]>([]);
const tagsFiltered = ref<string[]>([]);
const tagsSelected = ref<any[]>([]);

const premiumVideoFilter = ref(false);
const premiumScriptFilter = ref(false);

const filterExpanded = ref(false);
const rowsPerPageOptions = computed(() => {
	let initalVideos = DEFAULT_VIDEOS_PER_PAGE;
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

function onScroll() {
	// console.log('onscroll', arrivedState.bottom);
	if (arrivedState.bottom && videosFiltered.value.length >= 24) {
		pagination.value.rowsPerPage += DEFAULT_VIDEOS_PER_PAGE;
	}
}
// function onScrollTop() {
// 	console.log('onScrollTop', arrivedState.bottom);
// }

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

function filterFnPerformers(val: any, update: any, abort: () => void) {
	update(async () => {
		console.log('searching - performers');

		const needle = val.toLowerCase()
		try {
			if (needle === "" || needle === null) {
				performers.value = await apiIndex.getApi().index.getPerformers()
			} else {
				performers.value = await apiIndex.getApi().index.getPerformers(needle)
			}
			performersFiltered.value = performers.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
		} catch (err) {
			console.error(err);
			createNotify(err as string)
		}
	})
}

function videoClick(video: PartnerVideo, newWindow: boolean) {
	console.log('videoClick', video, newWindow);
	if (newWindow) {
		const routeData = router.resolve({ path: "/videos/" + video.partnerVideoId });
		window.open(routeData.href, '_blank');
	} else {
		router.push({
			path: "/videos/" + video.partnerVideoId
		})
	}
}

function filterAndSortVideos() {
	console.log('filterAndSortVideos');
	pagination.value.rowsPerPage = DEFAULT_VIDEOS_PER_PAGE;
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

	if (performersSelected.value.length > 0) {
		const tempVideosNested: PartnerVideo[] = []
		tempVideos.forEach(video => {
			let performerMatch = false;
			performersSelected.value.forEach(performerSelected => {
				if (video.performers !== undefined) {
					video.performers.forEach(performer => {
						if (performerSelected.name === performer.name) {
							performerMatch = true;
						}
					});
				}
			});
			if (performerMatch) {
				tempVideosNested.push(video);
			}
		});
		tempVideos = tempVideosNested;
	}

	if (!premiumVideoFilter.value) {
		const tempVideosNested: PartnerVideo[] = []
		tempVideos.forEach(video => {
			if (video.videoAccess === "public") {
				tempVideosNested.push(video);
			}
		});
		tempVideos = tempVideosNested;
	}

	if (!premiumScriptFilter.value) {
		const tempVideosNested: PartnerVideo[] = []
		tempVideos.forEach(video => {
			if (video.scriptAccess === "public") {
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

async function parseQuaryParams() {
	// tagsSelected.value.length = 0;
	// partnersSelected.value.length = 0;
	// filterExpanded.value = false;
	let filter = false;
	if (route.query !== undefined) {
		if (route.query.performerId && route.query.performerName) {
			console.log("route.query.performerId:", route.query.performerId);
			try {
				performers.value = await apiIndex.getApi().index.getPerformers(route.query.performerName as string)
				performers.value.forEach(performer => {
					if (performer.performerId === route.query.performerId) {
						performersSelected.value.push(performer);
					}
				});
				filter = true;
			} catch (err) {
				console.error(err);
				createNotify(err as string)
			}
		}
		if (route.query.tag) {
			console.log("route.query.tag:", route.query.tag);
			tagsSelected.value.push(route.query.tag)
			filter = true;
		} else {
			tagsSelected.value.length = 0;
		}
		if (route.query.partnerId) {
			const partnerId = route.query.partnerId as string;
			console.log("partnerId from route.query.partnerId:", partnerId);
			// const partner = JSON.parse(route.query.partner as string) as Partner;
			apiIndex.partners.forEach(partner => {
				if (partner.partnerId === partnerId) {
					partnersSelected.value.push(partner)
					filter = true;
				}
			});
		} else {
			partnersSelected.value.length = 0;
		}
	}
	if (filter) {
		premiumVideoFilter.value = true; // Disable all filtering to show all possible videos
		premiumScriptFilter.value = true; // Disable all filtering to show all possible videos
		filterExpanded.value = true;
	} else {
		filterExpanded.value = false;
	}
	// filterAndSortVideos();
}

async function setVideos() {
	try {
		if (route.meta.fav) {
			console.log('Favorites');

			loading.value = false;
			fav.value = true;
			videos.value = settings.favorites;
			setTags();
			console.log("videos.value:", videos.value);
			filterAndSortVideos();
		} else {
			fav.value = false;
			performers.value = await apiIndex.getApi().index.getPerformers();
			apiIndex.getIndex().then(_videos => {
				loading.value = false;
				videos.value = _videos

				// videos.value.reverse();
				// videos.value = await apiIndex.index.getVideos(undefined, undefined, undefined, 100);
				setTags();
				console.log("videos.value:", videos.value);
				filterAndSortVideos();
				console.log("video:", nonReactiveObject(videos.value[0]));

				// qtableref.value?.sort()
			}).catch((err: any) => {
				console.error(err);
				createNotify(err as string)
			});
		}
	} catch (err) { console.error(err); createNotify(err as string) }
}

async function resetView() {
	pagination.value.rowsPerPage = DEFAULT_VIDEOS_PER_PAGE;
	// Scroll to top
	const qtable = document.getElementById('qtable');
	qtable!.scrollTop = 0;

	await setVideos()
	parseQuaryParams()
}

const guardAfterEach = router.afterEach(async (to, from) => {
	console.log('ROUTING', to.path, from.path);

	if (to.path === "/videos") { // Will be called after router.afterEach. So router.afterEach will trigger once
		resetView()
	} else if (to.path === "/favorites") {
		resetView()
	}
})

// Container hight must match the parent to make the scroll look good.
function setHeightOfContainter() {
	const topVideosContainer = document.getElementById("topVideosContainer") as HTMLDivElement;
	if (topVideosContainer === null) {
		console.error("Could not find top container");

		// createNotify("Could not find top container");
		return;
	}
	const height = topVideosContainer.parentElement?.offsetHeight as number;
	console.log("height:", height);
	topVideosContainer.style.height = (height - 16) + "px"; // +16px to adjust for the paddings and margin
}

// const scrollY = 0;
function onDocumentScroll(e: Event) {
	// console.log(e);
	// // const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
	// const scrollTop = document.documentElement.scrollTop;
	// const scrollHeight = document.documentElement.scrollHeight;
	// console.log("scrollTop:", scrollTop, scrollHeight);
	// if (scrollTop > scrollY) {
	// 	scrollY++;
	// 	innerTable!.scrollTop += scrollTop;
	// } else {
	// 	scrollY--
	// 	innerTable!.scrollTop -= scrollTop;
	// }
	// if (scrollY < 50) scrollY = 50;
	// if (scrollY > 100) scrollY = 50;
	window.scroll(0, 0);
}

function onDocumentWheel(e: WheelEvent) {
	// console.log(e, isScrolling);
	const scrollingOnContainer = (e.target as any).classList.contains("q-page-container");
	// if (!isScrolling) innerTable!.scrollTop += e.deltaY
	if (scrollingOnContainer) innerTable!.scrollTop += e.deltaY; // TODO: This only scrolls on the sides
}

onBeforeUnmount(() => {
	console.log('Removing listeners');

	// document.removeEventListener("scroll", onDocumentScroll)
	// document.removeEventListener("wheel", onDocumentWheel)
	window.removeEventListener("resize", setHeightOfContainter)
	guardAfterEach(); // Remove guard listener
})

onMounted(async () => {
	console.log('onMounted - videos');
	window.addEventListener('resize', setHeightOfContainter);
	innerTable = document.getElementById("qtable") as HTMLDivElement;
	if (innerTable === null) {
		createNotify("Could not find inner table")
	}
	try {
		apiIndex.getPartners();
	} catch (err) {
		console.error(err);
		createNotify(err as string)
	}

	// const topVideosContainer = document.getElementById("topVideosContainer") as HTMLDivElement;
	// document.addEventListener('scroll', onDocumentScroll)
	// document.addEventListener('wheel', onDocumentWheel)
	// topScroll = useScroll(topVideosContainer)
	setHeightOfContainter();

	await parseQuaryParams()
	setVideos()
});
</script>

<style lang="sass" scoped>
</style>
