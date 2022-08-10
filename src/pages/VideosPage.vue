<template>
	<q-page class="">
		<div v-if="videos.length > 0">{{ videos[0] }}</div>
		<div class="q-pa-md">
			<q-badge v-for="(value, key) in tagColors" :key="key"
				:style="{ backgroundColor: value.color, color: value.textColor }" class="q-ml-xs">
				{{ key }}</q-badge>
			<q-table grid :card-container-class="cardContainerClass" title="Treats" :rows="videos" row-key="name"
				:filter="filter" hide-header v-model:pagination="pagination" :rows-per-page-options="rowsPerPageOptions"
				virtual-scroll>
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
						<template v-slot:append>
							<q-icon name="search" />
						</template>
					</q-input>
				</template>

				<template v-slot:item="props">
					<div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
						<q-card class="my-card">
							<!-- @error="props.row.images[0] = 'src/assets/315x300-no-image.png'" -->
							<q-img :src="props.row.images[0]" fit="fill" style="height: 300px"
								@error="props.row.images[0] = 'src/assets/315x300-no-image.png'"
								placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg==">
								<div class="absolute-bottom text-subtitle1 text-center">
									{{ props.row.title }}
									<!-- {{ props.row.images[0] }} -->
								</div>
								<!-- <template v-slot:error>
									<div class="absolute-full flex flex-center _bg-negative text-white">
										No image
									</div>
								</template> -->
							</q-img>

							<q-card-section>
								<div class="row">
									<div class="text-overline col bg-blue">{{
											partnerIdToPartnerName(props.row.partnerId)
									}}
									</div>
									<div class="col-auto bg-green" v-if="props.row.duration">

										{{

												dayjs.duration(props.row.duration * 1000).format('HH:mm:ss')
										}}
									</div>
								</div>
								<q-item-label lines="2">
									<q-badge v-for="(tag, index) in props.row.tags" :key="index"
										:style="{ backgroundColor: tagColors[tag].color, color: tagColors[tag].textColor }"
										class="q-ml-xs">
										{{ tag }}</q-badge>
								</q-item-label>
								<div class="full-width">

								</div>
								<!-- <div class="text-subtitle2">{{ props.row.description }}</div> -->
							</q-card-section>

							<q-card-section class="q-pt-none">
								{{ props.row.name }}
							</q-card-section>
						</q-card>
					</div>
				</template>
			</q-table>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { PartnerVideo, Partner } from 'src/_SCRIPTAPIINDEX';
import { computed, onMounted, ref, watch } from 'vue';
import { initApi, apiIndex } from '../logic/api-wrapper'
import { createNotify } from '../logic/utils'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const videos = ref<PartnerVideo[]>([]);
const $q = useQuasar()

const partners = ref<Partner[]>([]);

const tagColors = ref<any>({});
const tags = ref<any>([]);

// const columns = [
// 	{ name: 'name', label: 'Name', field: 'name' },
// 	{ name: 'calories', label: 'Calories (g)', field: 'calories' }
// ];

const cardContainerClass = computed(() => {
	return $q.screen.gt.xs
		? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '5' : '2')
		: null
})

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
	return 5
}

const filter = ref('')
const pagination = ref({
	page: 1,
	rowsPerPage: getItemsPerPage()
})

watch(() => $q.screen.name, () => {
	pagination.value.rowsPerPage = getItemsPerPage()
})

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
	console.log("tagColors.value:", tagColors.value);
}

function partnerIdToPartnerName(partnerId: string) {
	console.log('partnerIdToPartnerName', partnerId);
	let partnerName = "Unknown partner";
	partners.value.forEach(partner => {
		if (partner.partnerId === partnerId) {
			// console.log('MATCH!');
			partnerName = partner.name;
		}
	});
	return partnerName;
}

onMounted(async () => {
	console.log('onMounted - videos');
	initApi();
	try {
		partners.value = await apiIndex.index.getPartners();
		console.log("partners.value:", partners.value);

		videos.value = await apiIndex.index.getIndex();
		videos.value.reverse();
		setTags();
		console.log("videos.value:", videos.value);
	} catch (err) { console.error(err); createNotify(err as string) }
});
</script>

<style lang="sass" scoped>
.grid-masonry
  flex-direction: column
  height: 700px

  &--2
    > div
      &:nth-child(2n + 1)
        order: 1
      &:nth-child(2n)
        order: 2

    &:before
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3
    > div
      &:nth-child(3n + 1)
        order: 1
      &:nth-child(3n + 2)
        order: 2
      &:nth-child(3n)
        order: 3

    &:before,
    &:after
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
</style>
