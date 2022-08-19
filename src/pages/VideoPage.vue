<template>
	<q-page class="container q-pt-lg">
		<!-- {{ video }} -->
		<div v-if="video !== undefined" class="row">
			<div class="col-12 row">
				<div class="col-6">
					<q-carousel class="rounded-borders" style="heigth: 400px;" swipeable animated v-model="slide"
						thumbnails>
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
					<a class="col-auto _cursor-pointer" :href="video.videoUrl" target="_blank"
						style="text-decoration: none;">
						<q-chip class="bg-grey-4" icon="open_in_new">
							Open video on site
						</q-chip>
					</a>
				</div>

				<div class="col-12 row _q-pl-xs">
					<Tag v-for="(tag, index) in video?.tags" :key="tag" :tag="tag"></Tag>
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
import { partnerIdToPartnerName } from "src/logic/api-wrapper";
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

onMounted(() => {
	console.log('onMounted - video');
	console.log("route:", route, route.query);
	if (route.query.video) {
		try {
			video.value = JSON.parse(route.query.video as string) as PartnerVideo;
			console.log("video.value:", video.value);
		} catch (err) {
			console.error(err);
			createNotify("Could not parse video information");
		}
	} else {
		createNotify("Could not get video info from query");
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

<style scoped>
</style>
