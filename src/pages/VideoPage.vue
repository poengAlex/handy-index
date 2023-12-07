<template>
	<div class="row container">
		<div class="col-12 col-md-8 _shadow-1 rounded-borders q-pa-sm ">
			<div v-if="video !== undefined" class="row">
				<div class="col-12 _col-md-6">

					<q-carousel v-if="!imgError && (!externalVideo.active || !settings.allowExternalVideo)"
						class="rounded-borders" control-type="regular" arrows control-color="accent"
						style="max-height: 600px;" swipeable animated v-model="slide" thumbnails
						referrerpolicy="no-referrer">
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
					<q-img v-show="imgError" :src="imgError ? '315x300-no-image.png' : video.images![0]"
						@error="setImgError()" style="width: 100%;" />
					<template v-if="externalVideo.active">
						<q-banner v-if="!settings.allowExternalVideo" class="bg-warning text-black q-mt-sm rounded-borders">
							<template v-slot:avatar>
								<q-icon name="warning" color="black" />
							</template>
							It is possible to view the video here. We do not host any video content on our servers. The
							video is played externally from an iFrame and
							<b>{{ apiStore.partnerIdToPartnerName(video.partnerId) }}</b> might be gathering analytics
							as if you where visiting their site directly.
							<br>
							<q-btn class="text-white q-mt-sm" color="black" @click="settings.allowExternalVideo = true">
								Allow external videos
							</q-btn>
						</q-banner>
						<template v-else>
							<template v-if="settings.nsfw">
								<q-video :ratio="16 / 9" :src="externalVideo.url" />
								<q-banner v-if="bexDetected === false && false"
									class="bg-warning text-black rounded-borders">
									<template v-slot:avatar>
										<q-icon name="warning" color="black" />
									</template>
									<template>
										You will need the <b>Handy browser extension</b> to play this video with the
										script
										token. Please do the following:
										<ul>
											<li v-if="$q.platform.is.name !== 'chrome'">Download and install
												Chrome web browser. <a href="https://www.google.com/chrome/"
													target="_blank">https://www.google.com/chrome/</a>
											</li>
											<li>Download the Handy browser extension. <a
													href="https://chrome.google.com/webstore/detail/handy-browser-extension/jejnmoojnkkflpjalciaadbidbdfinko"
													target="_blank">Link</a></li>
											<li>Connect your Handy in the extension.</li>
											<li>Refresh this page.</li>
										</ul>
									</template>

								</q-banner>
							</template>

							<q-banner v-else class="bg-warning text-black rounded-borders">
								<template v-slot:avatar>
									<q-icon name="warning" color="black" />
								</template>
								An external video is found. NSFW is disabled in settings. Turn on NSFW to see the video.
								<q-btn class="text-white q-mt-sm" color="black" @click="settings.nsfw = true">
									Allow NSFW content
								</q-btn>
							</q-banner>
						</template>
					</template>

				</div>
				<div class=" col-12 row q-pt-sm">
					<div class="col-12 text-h4 ">{{ video?.title }}</div>
					<div class="col-12 row">
						<Partner class="col-auto" :partner-id="video?.partnerId" :partner="video.partnerName"></Partner>

					</div>

					<div class="col-12 row q-gutter-xs q-mb-sm _q-pl-xs">

						<div v-if="video.createdAt !== undefined" class="col-auto">
							<q-chip class="infoChip">
								Created {{ dayjs(video.createdAt).fromNow() }}
							</q-chip>
						</div>
						<div v-if="video.format?.format !== 'unknown'" class="col-auto">
							<q-chip class="infoChip">
								{{ video?.format?.format }} <span v-if="video?.format?.format === 'vr'">-
									{{ video.format.view }}</span>
							</q-chip>
						</div>
						<div class="col-auto">
							<q-chip class="infoChip">
								<Duration class="" :duration="video?.duration">
								</Duration>
							</q-chip>
						</div>
						<template v-if="video.scriptAccess === 'public'">
							<template v-for="(script, index) in scripts" :key="index">
								<div v-if="index === 0" class="col-auto cursor-pointer" @click="downloadToken(video, $q)">
									<q-chip class="infoChip" icon="download">
										Download script token (scripter: {{ script.scripter?.name }})
									</q-chip>
								</div>
							</template>
						</template>

						<q-chip v-else class="infoChip" icon="download">
							Premium script
							<q-tooltip>
								This is a premium script. Visit the site to get access.
							</q-tooltip>
						</q-chip>
						<a class="col-auto _cursor-pointer"
							:href="'mailto:alexander@sweettech.no?subject=I want to report a video&body=Hi%0D%0A%0D%0AI would like you to report a video on the index site.%0D%0A%0D%0A partnerVideoId: ' + video.partnerVideoId"
							target="_blank" style="text-decoration: none;">
							<q-chip class="infoChip" icon="warning">
								Report
							</q-chip>
						</a>
						<a class="col-auto _cursor-pointer" :href="video.videoUrl" target="_blank"
							style="text-decoration: none;">
							<q-chip class="infoChip" icon="open_in_new">
								Open video on site
							</q-chip>
						</a>

						<div v-if="settings.isFav(video)" class="col-auto" @click="settings.removeFromFav(video)">
							<q-chip class="infoChip cursor-pointer" icon="favorite">
								Remove from favorite
							</q-chip>
						</div>
						<div v-else class="col-auto" @click="settings.addToFav(video)">
							<q-chip class="infoChip cursor-pointer" icon="favorite_border">
								Add to favorite
							</q-chip>
						</div>
					</div>

					<div class="col-12 row _q-pl-xs">
						<Tag v-for="tag in video?.tags" :key="tag" :tag="tag"></Tag>
					</div>
					<div class="col-auto q-mt-sm q-mb-sm">
						<!-- Rate the script: -->
						<q-rating v-model="ratingModel" size="2em" :max="RATING_STEPS" color="primary"
							@update:model-value="rateScript(scripts[0])">

						</q-rating>
						<q-tooltip>
							Rate the script
						</q-tooltip>
						<small v-if="ratingUser !== undefined"><br>Your rating: {{ ratingUser }} stars</small>
					</div>
					<div class="col-12 _q-pa-sm q-pl-none q-pr-sm q-pt-sm">
						<q-banner class="infoChip " rounded>
							<template v-slot:avatar>
								<q-icon name="description" color="black" />
							</template>
							{{ video?.description }}
						</q-banner>

					</div>
				</div>
			</div>
		</div>
		<div v-if="otherVideos.length > 0" class="col-12 col-md-4 q-pl-sm q-pt-sm gt-sm">
			<div class="_shadow-1 _no-box-shadow rounded-borders q-pa-sm ">
				<div class="text-h6 ">
					Other videos from same site
				</div>
				<!-- <p v-for="video in otherVideos">{{video}}</p> -->
				<VideoElement class="q-mb-sm" v-for="video in otherVideos" :key="video.partnerVideoId" :table-value="video"
					@click="videoClick">
				</VideoElement>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { apiIndex, downloadToken, initApi } from "src/logic/api-wrapper";
import { createNotify, createNotifySuccess, createNotifyWarning, showConnectionKeyDialog, isVideoVoted, RATING_STEPS, valueToRating, randomIntFromInterval } from "src/logic/utils";
import { PartnerVideo, Script } from "src/_SCRIPTAPIINDEX";
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSettingsStore } from '../stores/settings'
import { useIndexStore } from '../stores/apiIndex'
import Partner from "src/components/Partner.vue";
import Tag from "src/components/Tag.vue";
import Duration from "src/components/Duration.vue";
// import { handy } from "src/logic/handy";
import { useQuasar } from 'quasar'
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import VideoElement from "src/components/VideoElement.vue";

dayjs.extend(relativeTime);
// TODO: add created at chip when returned from DB
const settings = useSettingsStore()
const apiStore = useIndexStore();
const route = useRoute();
const router = useRouter();
const video = ref<PartnerVideo>();
const otherVideos = ref<PartnerVideo[]>([]);
const slide = ref(0);
const scripts = ref<Script[]>([]);
const imgError = ref(false);
const ratingModel = ref<number>(0);
const ratingUser = ref<number>();

const externalVideo = ref({
	active: false,
	url: ""
});
const bexDetected = ref(true);
const $q = useQuasar();

function setImgError() {
	console.warn("image error");
	imgError.value = true;
}

async function rateScript(script: Script) {
	console.log('Rating script', ratingModel.value);
	const value = valueToRating(ratingModel.value, true)
	console.log("value:", value, ratingModel.value);
	const voted = isVideoVoted(script);
	const partnerVideoId = video.value?.partnerVideoId as string;
	try {
		const res = await apiStore.getApi().index.createScriptRating(partnerVideoId, script.scriptId, { value });
		console.log("res:", res);
		ratingUser.value = ratingModel.value;
		if (voted) {
			settings.videoVotes.forEach(vote => {
				if (vote.scriptId === script.scriptId) {
					vote.value = value;
				}
			});
		} else {
			settings.videoVotes.push({
				value,
				scriptId: script.scriptId
			});
		}
		createNotifySuccess("Rating submitted")
	} catch (err) {
		console.error(err);
		createNotify(err as string)
	}
}

function videoClick(video: PartnerVideo) {
	console.log('videoClick', video);
	router.push({
		path: "/videos/" + video.partnerVideoId
	})
}

async function setVideo() {
	console.log('setVideo');

	const partnerVideoId = route.params.partnerVideoId as string;
	console.log("partnerVideoId:", partnerVideoId);

	try {
		video.value = await apiStore.getVideo(partnerVideoId);
		console.log("video.value:", JSON.parse(JSON.stringify(video.value)));

		if (video.value.partnerId === "01GA3NMS2VGZM7C61T88D5K53X") { // pornhubs ID
			externalVideo.value.url = 'https://www.pornhub.com/embed/' + video.value.externalRef;
			externalVideo.value.active = true;
		} else if (video.value.partnerId === "01GHTRB0SDJG3CQJB9BG24XX20") { // youtube
			externalVideo.value.url = 'https://www.youtube.com/embed/' + video.value.externalRef;
			externalVideo.value.active = true;
		}
		scripts.value = await apiStore.getScripts(partnerVideoId);
		console.log("scripts.value:", scripts.value);
		if (scripts.value.length > 0 && scripts.value[0].rating !== null && scripts.value[0].rating !== undefined) {
			ratingModel.value = valueToRating(scripts.value[0].rating)
			console.log("ratingModel.value:", ratingModel.value);
		}

		settings.videoVotes.forEach(vote => {
			if (vote.scriptId === scripts.value[0].scriptId) {
				// ratingModel.value = (vote.value / 10) + 1
				ratingUser.value = valueToRating(vote.value);
			}
		});
		let start = 100; // if start -= 25; => 5 runs max
		otherVideos.value.length = 0;

		while (start >= 0 && otherVideos.value.length === 0) {
			const skip = randomIntFromInterval(0, start);
			console.log("skip:", skip);

			const otherVideosTemp = await apiIndex.index.getVideos(undefined, undefined, undefined, [video.value.partnerId], 4, skip);
			otherVideosTemp.forEach(otherVideo => {
				if (otherVideo.partnerVideoId !== video.value?.partnerVideoId) {
					otherVideos.value.push(otherVideo);
				}
			});
			start -= 25;
		}

		// otherVideos.value = await apiIndex.index.getIndex();
		// otherVideos.value.slice(0, 10);
		console.log("otherVideos:", otherVideos);
	} catch (err) {
		console.error(err);
		createNotify(err as string)
	}
}

const guardAfterEach = router.afterEach(async (to, from) => {
	console.log('ROUTING', to.path);
	if (to.path.includes("/videos/")) {
		setVideo()
	}
})

onBeforeUnmount(() => { // Will be called after router.afterEach. So router.afterEach will trigger once
	console.log('Removing listners');

	guardAfterEach(); // Remove guard listner
})

onMounted(async () => {
	console.log('onMounted - video');
	console.log("route:", route, route.query);
	await setVideo();

	setTimeout(() => {
		const images = document.getElementsByTagName("img");
		// console.log("images:", images, images.length);
		for (let index = 0; index < images.length; index++) {
			const image = images[index];
			image.referrerPolicy = "no-referrer"; // Do not send referer
			// console.log("image:", image);
			image.onerror = function () {
				image.src = '315x300-no-image.png'
			}
		}
	}, 1); // The images are not drawn yet. This might not work very good on all browsers. Backend should do something smarter.

	// SEARCH for bex plugin
	setTimeout(() => {
		const bexIdentifier = document.getElementById("bex-identifier");
		if (bexIdentifier !== null) {
			console.log("bexIdentifier:", bexIdentifier);
			bexDetected.value = true;
			const key = bexIdentifier.getAttribute("data-key");
			console.log("key (from BEX):", key);
			if (key !== null && key !== "") {
				settings.connectionKey = key;
			} else if (key !== "") {
				if (key !== settings.connectionKey) {
					createNotifyWarning("Connection key is differnet in plugin and on the index site!")
				}
			}
		} else {
			bexDetected.value = false;
			console.log('BEX not detected');
		}
	}, 1000);
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
