<template>
	<q-page>
		{{ video }}
		<div class="row">
			<div class="col-6">
				<q-carousel class="rounded-borders" style="heigth: 400px;" swipeable animated v-model="slide"
					thumbnails>
					<q-carousel-slide v-for="(img, index) in video?.images" :name="index"
						:img-src="settings.nsfw ? img : 'https://via.placeholder.com/315x300.png?text=NSFW'" />
					<q-carousel-slide v-for="(gif, index) in video?.gifs" :name="video?.images.length + index"
						:img-src="settings.nsfw ? gif : 'https://via.placeholder.com/315x300.png?text=NSFW'" />
				</q-carousel>
			</div>
			<div class="col-12 row">
				<div class="col-12 text-h4">{{ video?.title }}</div>
				<Partner class="col-12" :partner-id="video?.partnerId"></Partner>
				<div class="col-12 row q-gutter-lg q-mb-sm">
					<div class="col-auto">
						{{ video?.format?.format }} <span v-if="video?.format?.format === 'vr'">-
							{{ video.format.view }}</span>
					</div>
					<Duration class="" :duration="video?.duration">
					</Duration>

				</div>

				<div class="col-12 row">
					<Tag v-for="(tag, index) in video?.tags" :key="tag" :tag="tag"></Tag>
				</div>
				<div class="col-12">
					{{ video?.description }}
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
});
</script>

<style scoped>
</style>
