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
				<q-input v-model="requestUrl"></q-input>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn flat label="Cancel" color="warning" v-close-popup />
				<q-btn flat label="Request" color="primary" @click="requestNewVideo(requestUrl)" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
	<q-banner v-if="requests.length === 0 && !loading" class="bg-warning text-black" style="min-height:200px;">
		<template v-slot:avatar>
			<q-icon name="warning" color="black" />
		</template>
		Something went wrong and we could not retrive data. You need to be online with your Handy to see this list.
		<br>
		<q-btn class="q-mt-lg" icon="wifi" @click="connectDialogWitDataRefresh()" color="white" text-color="black">
			Connect your Handy</q-btn>
		<q-btn class="q-mt-lg q-ml-sm" icon="refresh" @click="getData" color="white" text-color="black">Refresh</q-btn>
	</q-banner>
	<div v-else>
		<q-banner class="bg-info text-black rounded-borders q-mb-sm" style="max-width:500px;">
			<template v-slot:avatar>
				<q-icon name="info" color="black" />
			</template>
			You can request us to script a video. We will script the video with the highest votes at any given time.
			Upvote your favorite video here.

			<br>
			Tip: You can also request a video using the Handy browser extension for Chrome.
			<br>
			<q-btn class="q-mt-lg" icon="post_add" @click="requestDialog=true">Add a new request</q-btn>

		</q-banner>

		<div class="text-h3">Pending requests</div>
		<q-list separator style="max-width: 500px;">
			<template v-for="(request,index) in requests" :key="request.requestId">

				<q-item>
					<q-item-section top thumbnail class="q-ml-none">
						<img
							:src="settings.nsfw ? request.thumbnail : 'https://via.placeholder.com/315x300.png?text=NSFW'">
					</q-item-section>
					<q-item-section>
						<q-item-label>{{request.domain}}</q-item-label>
						<q-item-label caption lines=" 2">{{request.title}}
						</q-item-label>
						<q-item-label>
							<q-btn :href="request.videoUrl" target="_blank" size="xs">Go to video</q-btn>
						</q-item-label>
					</q-item-section>

					<q-item-section side top>
						<q-item-label caption>
							{{dayjs((request as any).createdAt).fromNow()}}
							<q-tooltip>
								Video request was added {{request.createdAt}}
							</q-tooltip>
						</q-item-label>

						<q-item-label>
							<q-icon name="thumb_up_alt" :color="isUpvoted(request)? 'primary' : 'black'"
								class="cursor-pointer" @click="upvote(request)" size="sm">
								<q-tooltip>
									Upvote this request
								</q-tooltip>
							</q-icon>
							{{request.votes}}
							<q-tooltip>
								Number of upvotes
							</q-tooltip>
						</q-item-label>
					</q-item-section>
				</q-item>

				<q-separator v-if="index !== (requests.length - 1)" spaced inset />
			</template>
		</q-list>
		<q-inner-loading :showing="loading">
			<q-spinner-gears size="50px" color="primary" />
		</q-inner-loading>
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
dayjs.extend(relativeTime);

const api = useIndexStore()
const $q = useQuasar();
const settings = useSettingsStore();
const requests = ref<VideoRequest[]>([])
const loading = ref(false);
const requestDialog = ref(false);
const requestUrl = ref("");
async function getData() {
	loading.value = true;
	try {
		requests.value = await api.getApi().videoRequests.getRegisteredVideoRequests(100);
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

<style scoped>

</style>
