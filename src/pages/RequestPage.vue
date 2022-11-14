<template>
	<q-dialog v-model="requestDialog" position="standard">
		<q-card style="width: 700px; max-width: 80vw;">
			<q-card-section>
				<div class="text-h6">Request a new url</div>
			</q-card-section>
			<q-card-section class="q-pt-none">
				The request needs to be approved before it will show on this list.
			</q-card-section>
			<q-card-section class="q-pt-none">
				<q-input v-model="requestUrl" placeholder="https://"></q-input>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn flat label="Cancel" color="warning" v-close-popup />
				<q-btn flat label="Request" color="primary" @click="requestNewVideo(requestUrl)" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
	<div class="container">
		<q-banner v-if="(requests.length === 0 && !loading)" class="bg-warning text-black" style="">
			<template v-slot:avatar>
				<q-icon name="warning" color="black" />
			</template>
			Something went wrong and we could not retrieve data. You need to be online with your Handy to see this list.
			<br>
			<q-btn class="q-mt-lg" icon="wifi" @click="connectDialogWitDataRefresh()" color="white" text-color="black">
				Connect your Handy</q-btn>
			<q-btn class="q-mt-lg q-ml-sm" icon="refresh" @click="getData" color="white" text-color="black">Refresh
			</q-btn>
		</q-banner>
		<div v-else class="row">
			<q-banner class="bg-info text-black rounded-borders q-mb-sm col-12" style="">
				<template v-slot:avatar>
					<q-icon name="info" color="black" />
				</template>
				You can request us to script a video. We will script the video with the highest votes at any given time.
				Upvote your favorite video here.

				<br>
				Tip: You can also request a video using the Handy browser extension for Chrome.
				<br>
				<q-btn class="q-mt-lg" icon="post_add" @click="requestDialog = true">Add a new script request</q-btn>

			</q-banner>

			<div class="text-h3 col-12">Pending requests</div>

			<template v-for="(request) in requests" :key="request.requestId">
				<div class="col-12 col-sm-6 col-md-4 col-lg-4 q-pa-xs cursor-pointer">
					<q-responsive :ratio="16 / 9" @click="goToRequest(request)">
						<q-img
							:src="settings.nsfw ? request.thumbnail : 'https://via.placeholder.com/300x155.png?text=NSFW'"
							fit="contain"
							@error="request.thumbnail = 'https://via.placeholder.com/300x155.png?text=No image'"
							referrerpolicy="no-referrer">
						</q-img>
						<q-tooltip @before-show="setPreview(request)" anchor="center middle" self="center middle"
							:delay="200">
							<div style="width: 400px !important" @click="goToRequest(request)">

								<q-img
									:src="settings.nsfw ? request.images[imagePreviewNr] : 'https://via.placeholder.com/300x155.png?text=NSFW'"
									fit="contain"
									@error="request.images[imagePreviewNr] = 'https://via.placeholder.com/300x155.png?text=No image'"
									referrerpolicy="no-referrer">
								</q-img>
								<div class="text-h6 ">
									{{ request.title }}
								</div>
								<div class="text-subtitle1 ">
									{{ request.description }}
								</div>
								<div class="row">
									<q-chip dense v-for="(tag, index) in request.tags" :key="index"
										class="q-ma-none q-ml-xs q-mb-xs col-auto" color="black" text-color="white">
										{{ tag }}</q-chip>
								</div>
							</div>

						</q-tooltip>
					</q-responsive>
					<div class="requestSubField q-pb-sm">
						<div class="ellipsis-2-lines text-picture text-subtitle1" style="height: 54px;">
							{{ request.title }}
						</div>
						<div class="row">
							<q-btn class="col" :href="request.videoUrl" target="_blank" size="xs"
								:color="settings.darkMode ? 'grey-2' : 'black'"
								:text-color="settings.darkMode ? 'black' : 'grey-2'">Go
								to video
							</q-btn>
							<div class="col-auto q-pl-md q-pt-xs">
								<Duration :duration="request.duration" />
							</div>
							<div class="col-auto q-pl-md">
								<q-icon name="thumb_up_alt"
									:color="isUpvoted(request) ? 'primary' : (settings.darkMode ? 'grey-2' : 'black')"
									class="cursor-pointer q-pr-sm" @click="upvote(request)" size="sm">
								</q-icon>
								{{ request.votes }}
							</div>
						</div>

					</div>

				</div>
			</template>
			<div class="col-12 row justify-end q-gutter-sm q-mt-lg">
				<div class="col text-left">
					Page {{ page }}
				</div>
				<q-btn :disable="page === 0" @click="page--; getData();" class="col-auto"
					:color="settings.darkMode ? 'grey-2' : 'black'"
					:text-color="!settings.darkMode ? 'grey-2' : 'black'">Previous</q-btn>
				<q-btn :disable="requests.length !== REQUEST_PER_PAGE" @click="page++; getData();" class="col-auto"
					:color="settings.darkMode ? 'grey-2' : 'black'"
					:text-color="!settings.darkMode ? 'grey-2' : 'black'">Next</q-btn>
			</div>

			<q-inner-loading :showing="loading">
				<q-spinner-gears size="50px" :color="settings.darkMode ? 'grey-2' : 'black'" />
			</q-inner-loading>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { createNotify, createNotifySuccess, createNotifyWarning, showConnectionKeyDialog } from "src/logic/utils";
import { useIndexStore } from "src/stores/apiIndex";
import { useSettingsStore } from "src/stores/settings";
import { VideoRequest } from "src/_SCRIPTAPIINDEX";
import { onMounted, ref } from "vue";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import Duration from "src/components/Duration.vue";
dayjs.extend(relativeTime);
const REQUEST_PER_PAGE = 24;
const page = ref(0);
const api = useIndexStore()
const $q = useQuasar();
const settings = useSettingsStore();
const requests = ref<VideoRequest[]>([])
const loading = ref(false);
const requestDialog = ref(false);
const requestUrl = ref("");

const imagePreviewNr = ref(0);
const imagePreviewCount = ref(0);

let previewInterval: number;

function goToRequest(request: VideoRequest) {
	console.log("goToRequest. request:", request);
	window.open(request.videoUrl, '_blank');
}

function setPreview(request: VideoRequest) {
	// console.log('setPreview', request);
	clearInterval(previewInterval);
	imagePreviewNr.value = 0;
	imagePreviewCount.value = request.images?.length as number;
	previewInterval = setInterval(() => {
		if (imagePreviewNr.value < imagePreviewCount.value) {
			imagePreviewNr.value++;
		} else {
			imagePreviewNr.value = 0;
		}
	}, 500) as unknown as number;
}

async function getData() {
	loading.value = true;
	try {
		requests.value = await api.getApi().videoRequests.getRegisteredVideoRequests(REQUEST_PER_PAGE, REQUEST_PER_PAGE * page.value);
		console.log("requests.value:", requests.value);
		console.log("request:", JSON.parse(JSON.stringify(requests.value[0])));
	} catch (err) {
		console.error(err);
		createNotify(err as string)
	}
	loading.value = false;
}

async function requestNewVideo(url: string) {
	try {
		const res = await api.getApi().videoRequests.createVideoRequest({
			url
		});
		console.log("res:", res);
		requestUrl.value = "";
		createNotifySuccess("Request sent");
	} catch (err) {
		console.error(err);
		createNotify(err as string)
	}
}

async function upvote(request: VideoRequest) {
	console.log('upvote', request);
	const upvoted = isUpvoted(request);
	if (upvoted) {
		createNotifyWarning("Already upvoted");
	} else {
		try {
			const res = await api.getApi().videoRequests.createVideoRequestVote(request.requestId);
			console.log("res:", res);
			request.votes++;
			settings.requestUpvotes.push(request.requestId);
		} catch (err) {
			console.error(err);
			createNotify(err as string)
		}
	}
}

function isUpvoted(request: VideoRequest) {
	const isFound = settings.requestUpvotes.some(requestId => {
		if (requestId === request.requestId) {
			return true;
		}

		return false;
	});
	return isFound;
}

function connectDialogWitDataRefresh() {
	showConnectionKeyDialog($q, (key: string) => {
		console.log("key:", key);
		getData();
	});
}
onMounted(async () => {
	console.log('onMounted - request');
	console.log("settings.connectionKe:", settings.connectionKey);

	if (settings.connectionKey === "" || settings.connectionKey === undefined) {
		connectDialogWitDataRefresh()
	} else {
		getData();
	}
});
</script>

<style lang="scss">
//Request page
.body--dark .requestSubField {
	border-bottom: 2px solid $grey-2;
}

.body--light .requestSubField {
	border-bottom: 2px solid $grey-10;
}
</style>
