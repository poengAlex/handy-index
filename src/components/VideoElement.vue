<template>
	<q-card class="cursor-pointer" v-if="video !== undefined" @click.left="$emit('click', video)"
		@click.right.prevent="$emit('clickRight', video)">
		<q-responsive :ratio="16 / 9">
			<q-img v-if="video.thumbnail !== null"
				:src="settings.nsfw ? video.thumbnail : 'https://via.placeholder.com/315x300.png?text=NSFW'" fit="fill"
				@error="video!.thumbnail = '315x300-no-image.png'">
				<div class="absolute-bottom" style="height: 40%;padding: 0px;">
					<div class="row items-center justify-evenly full-height full-width">
						<div class="ellipsis-2-lines text-picture text-subtitle1 q-pl-lg q-pr-lg">
							{{ video.title }}
						</div>
					</div>

					<!-- <q-tooltip>
						{{ video.title }}
					</q-tooltip> -->
				</div>
			</q-img>
			<q-img v-else-if="video.images !== undefined"
				:src="settings.nsfw ? video.images[0] : 'https://via.placeholder.com/315x300.png?text=NSFW'" fit="fill"
				@error="(video?.images as string[])[0] = '315x300-no-image.png'">
				<div class="absolute-bottom" style="height: 40%;padding: 0px;">
					<div class="row items-center justify-evenly full-height full-width">
						<div class="ellipsis-2-lines text-picture text-subtitle1 q-pl-lg q-pr-lg">
							{{ video.title }}
						</div>
					</div>

					<!-- <q-tooltip>
						{{ video.title }}
					</q-tooltip> -->
				</div>
			</q-img>

			<q-tooltip anchor="center middle" self="center middle" :delay="1000">
				<div style="width: 400px !important">
					<q-img v-if="video.gifs !== undefined"
						:src="settings.nsfw ? video.gifs[0] : 'https://via.placeholder.com/315x300.png?text=NSFW'"
						fit="fill" width="100%" @error="(video?.gifs as string[])[0] = '315x300-no-image.png'">
					</q-img>
					<div class="row">
						<partner :partner-id="video.partnerId"></partner>
						<div class="col-auto text-overline  _bg-green" v-if="video.duration">

							{{

							dayjs.duration(video.duration *
							1000).format('HH') === '00' ? dayjs.duration(video.duration *
							1000).format('mm:ss') : dayjs.duration(video.duration *
							1000).format('HH:mm:ss')
							}}
						</div>
					</div>
					<div class="text-h6 ">
						{{ video.title }}
					</div>
					<div class="text-subtitle1 ">
						{{ video.description }}
					</div>
					<div class="text-subtitle1">
						<!-- TODO: Add with dayjs when implemented -->
						<!-- {{ video.createdAt }} -->
					</div>
					<div class="row">
						<q-chip dense v-for="(tag, index) in video.tags" :key="index"
							class="q-ma-none q-ml-xs q-mb-xs col-auto" color="black" text-color="white">
							{{ tag }}</q-chip>
					</div>

				</div>
			</q-tooltip>
		</q-responsive>

		<q-card-section class="q-pa-xs q-pb-sm">
			<div class="row">
				<partner class="q-pl-sm" :partner-id="video.partnerId" :partner="video.partnerName"></partner>
				<div class="col-auto text-overline  _bg-green" v-if="video.duration">

					{{

					dayjs.duration(video.duration *
					1000).format('HH') === '00' ? dayjs.duration(video.duration *
					1000).format('mm:ss') : dayjs.duration(video.duration *
					1000).format('HH:mm:ss')
					}}
				</div>
				<q-btn dense class="col-auto" flat icon="more_vert" @click.stop="">
					<q-menu>
						<q-list style="width: 200px">
							<q-item clickable v-close-popup @click="createNotifyWarning('not implemented')">
								<q-item-section avatar>
									<q-icon color="primary" name="playlist_add" />
								</q-item-section>
								<q-item-section>Add to playlist</q-item-section>
							</q-item>
							<q-item v-if="!settings.isFav(video)" clickable v-close-popup
								@click="settings.addToFav(video)">
								<q-item-section avatar>
									<q-icon color="primary" name="favorite_border" />
								</q-item-section>
								<q-item-section>Favorite</q-item-section>
							</q-item>
							<q-item v-else clickable v-close-popup @click="settings.removeFromFav(video)">
								<q-item-section avatar>
									<q-icon color="primary" name="favorite" />
								</q-item-section>
								<q-item-section>Ufavorite</q-item-section>
							</q-item>
							<q-separator />
							<q-item clickable v-close-popup @click="downloadToken(video,$q)">
								<q-item-section avatar>
									<q-icon color="secondary" name="file_download" />
								</q-item-section>
								<q-item-section>Download token</q-item-section>
							</q-item>
							<q-separator />
							<q-item clickable v-close-popup @click="createNotifyWarning('not implemented')">
								<q-item-section avatar>
									<q-icon color="warning" name="warning" />
								</q-item-section>
								<q-item-section>Report</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</q-btn>
			</div>
			<div class="column">
				<!-- <q-item-label :lines="video.lines !== undefined ? video.lines : 2" class="col-12"
					style="min-height: 48px;" @mouseenter="video.lines = 0" @mouseleave="video.lines = 2">
					<tag v-for="(tag, index) in video.tags" :key="index" :tag="tag"></tag> -->
				<q-item-label class="col-12" style="min-height: 48px;" lines="2">
					<tag v-for="(tag, index) in video.tags" :key="index" :tag="tag"></tag>
					<q-tooltip v-if="video.tags !== undefined && video.tags?.length > 0" max-width="300px"
						anchor="center middle" self="center middle" :delay="300">
						<div class="row">
							<tag v-for="(tag, index) in video.tags" :key="index" :tag="tag"></tag>
						</div>
					</q-tooltip>
				</q-item-label>
			</div>
		</q-card-section>
	</q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { createNotifyWarning } from "src/logic/utils";
import { PartnerVideo } from "src/_SCRIPTAPIINDEX";
import { useSettingsStore } from '../stores/settings'
import Partner from "./Partner.vue";
import Tag from "./Tag.vue";
import { downloadToken } from "src/logic/api-wrapper";
import { useQuasar } from "quasar";
const settings = useSettingsStore()
dayjs.extend(relativeTime);
dayjs.extend(duration);
const propsIn = defineProps(['tableValue']);
const video = ref<PartnerVideo>();
const $q = useQuasar();

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
	(e: 'click', video: PartnerVideo): void
	(e: 'clickRight', video: PartnerVideo): void
}>();

onMounted(() => {
	// console.log('onMounted');
	if (propsIn.tableValue.row !== undefined) {
		video.value = propsIn.tableValue.row;
	} else {
		video.value = propsIn.tableValue;
	}
});
</script>

<style scoped lang="scss">
$paddingEnd: 0px;

.text-picture {
	// height: 35%;
	line-height: 1.2;
	padding-top: $paddingEnd;
	padding-bottom: $paddingEnd;
	overflow: hidden;
}
</style>
