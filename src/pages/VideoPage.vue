<template>
	<q-page class="container q-pa-sm q-pt-lg">
		<!-- {{ video }} -->
		<div v-if="video !== undefined" class="row">
			<div class="col-12 row">
				<div class="col-12 col-md-6">
					<q-carousel class="rounded-borders" control-type="regular" arrows control-color="accent"
						style="heigth: 400px;" swipeable animated v-model="slide" thumbnails>
						<template v-if="video.images !== undefined">
							<q-carousel-slide v-for="(img, index) in video?.images" :name="index" :key="index"
								:img-src="settings.nsfw ? img : 'https://via.placeholder.com/315x300.png?text=NSFW'" />
							<q-carousel-slide v-for="(gif, index) in video?.gifs" :name="video?.images.length + index"
								:img-src="settings.nsfw ? gif : 'https://via.placeholder.com/315x300.png?text=NSFW'"
								:key="index" />
						</template>
						<template v-else>
							<q-carousel-slide name="no-image" img-src="315x300-no-image.png" />
						</template>

					</q-carousel>
				</div>

			</div>
			<div class=" col-12 row">
				<div class="col-12 text-h4">{{ video?.title }}</div>
				<div class="col-12">
					<Partner class="col-3" :partner-id="video?.partnerId"></Partner>

				</div>

				<div class="col-12 row q-gutter-xs q-mb-sm _q-pl-xs">

					<div v-if="video.format?.format !== 'unknown'" class="col-auto">
						<q-chip class="bg-grey-4">
							{{ video?.format?.format }} <span v-if="video?.format?.format === 'vr'">-
								{{ video.format.view }}</span>
						</q-chip>
					</div>
					<div class="col-auto">
						<q-chip class="bg-grey-4">
							<Duration class="" :duration="video?.duration">
							</Duration>
						</q-chip>
					</div>
					<div class="col-auto cursor-pointer" @click="downloadToken(video as PartnerVideo)">
						<q-chip class="bg-grey-4" icon="download">
							Download script token
						</q-chip>
					</div>
					<a class="col-auto _cursor-pointer" :href="video.videoUrl" target="_blank"
						style="text-decoration: none;">
						<q-chip class="bg-grey-4" icon="open_in_new">
							Open video on site
						</q-chip>
					</a>
				</div>

				<div class="col-12 row _q-pl-xs">
					<Tag v-for="tag in video?.tags" :key="tag" :tag="tag"></Tag>
				</div>
				<div class="col-12 _q-pa-sm q-pl-none q-pr-sm q-pt-sm">
					<q-banner class="bg-grey-4 " rounded>
						<template v-slot:avatar>
							<q-icon name="description" color="black" />
						</template>
						{{ video?.description }}
					</q-banner>

				</div>
			</div>

		</div>

	</q-page>
</template>

<script setup lang="ts">
import { apiIndex, downloadToken, initApi, partnerIdToPartnerName } from "src/logic/api-wrapper";
import { createNotify } from "src/logic/utils";
import { PartnerVideo } from "src/_SCRIPTAPIINDEX";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useSettingsStore } from '../stores/settings'
import Partner from "src/components/Partner.vue";
import Tag from "src/components/Tag.vue";
import Duration from "src/components/Duration.vue";
const settings = useSettingsStore()
const route = useRoute();
const video = ref<PartnerVideo>();
const slide = ref(0)

onMounted(async () => {
	console.log('onMounted - video');
	console.log("route:", route, route.query);
	initApi();
	const partnerVideoId = route.params.partnerVideoId;
	console.log("partnerVideoId:", partnerVideoId);

	try {
		video.value = await apiIndex.index.getVideo(partnerVideoId as string);
	} catch (err) {
		console.error(err);
		createNotify(err as string)
	}

	setTimeout(() => {
		const images = document.getElementsByTagName("img");
		// console.log("images:", images, images.length);
		for (let index = 0; index < images.length; index++) {
			const image = images[index];
			// console.log("image:", image);
			image.onerror = function () {
				image.src = '315x300-no-image.png'
			}
		}
	}, 1); // The images are not drawn yet. This might not work very good on all browsers. Backend should do something smarter.
});
</script>

<style lang="scss">
//Hide scrollbar
.q-carousel__navigation--bottom {
	scrollbar-width: none !important;
	-ms-overflow-style: none !important;
}

.q-carousel__navigation--bottom::-webkit-scrollbar {
	width: 0;
	height: 0;
	display: none;
}
</style>
