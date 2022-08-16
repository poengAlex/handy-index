<template>
	<q-card class="my-card" v-if="video !== undefined">
		<q-responsive :ratio="16 / 9">
			<q-img :src="video.images[0]" fit="fill" @error="video.images[0] = '315x300-no-image.png'">
				<div class="absolute-bottom text-subtitle1 text-center ellipsis-2-lines" style="height: 40%;">
					{{ video.title }}
					<q-tooltip>
						{{ video.title }}
					</q-tooltip>
				</div>
			</q-img>
			<q-tooltip anchor="center middle" self="center middle" :delay="1000">
				<div style="width: 400px !important">
					<q-img :src="video.gifs[0]" fit="fill" width="100%" @error="video.gifs[0] = '315x300-no-image.png'">
					</q-img>
					<div class="row">
						<div class="text-overline col _bg-blue">{{
								partnerIdToPartnerName(video.partnerId)
						}}
						</div>
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
				<div class="text-overline col _bg-blue q-pl-sm">{{
						partnerIdToPartnerName(video.partnerId)
				}}
				</div>
				<div class="col-auto text-overline  _bg-green" v-if="video.duration">

					{{

							dayjs.duration(video.duration *
								1000).format('HH') === '00' ? dayjs.duration(video.duration *
									1000).format('mm:ss') : dayjs.duration(video.duration *
										1000).format('HH:mm:ss')
					}}
				</div>
				<q-btn dense class="col-auto" flat icon="more_vert">
					<q-menu>
						<q-list style="width: 150px">
							<q-item clickable v-close-popup @click="createNotifyWarning('not implemented')">
								<q-item-section>Add to playlist</q-item-section>
							</q-item>
							<q-item clickable v-close-popup @click="createNotifyWarning('not implemented')">
								<q-item-section>Favorite</q-item-section>
							</q-item>
							<q-separator />
							<q-item clickable v-close-popup @click="createNotifyWarning('not implemented')">
								<q-item-section>Report</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</q-btn>
			</div>
			<div class="column">
				<q-item-label lines="2" class="col" style="min-height:48px">
					<q-chip v-for="(tag, index) in video.tags" :key="index" class="q-ma-none q-ml-xs q-mb-xs"
						color="black" text-color="white" size="sm">
						{{ tag }}</q-chip>
					<q-tooltip max-width="300px" anchor="center middle" self="center middle">
						<div class="row">
							<q-chip dense v-for="(tag, index) in video.tags" :key="index"
								class="q-ma-none q-ml-xs q-mb-xs col-auto" color="black" text-color="white">
								{{ tag }}</q-chip>
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
import { partners, partnerIdToPartnerName } from '../logic/api-wrapper';
import { createNotifyWarning } from "src/logic/utils";
import { PartnerVideo } from "src/_SCRIPTAPIINDEX";
dayjs.extend(relativeTime);
dayjs.extend(duration);
const propsIn = defineProps(['tableValue']);
const video = ref<PartnerVideo>();
const emit = defineEmits<{
	(e: 'change', newValue: any, key: string): void
}>();

onMounted(() => {
	// console.log('onMounted');
	video.value = propsIn.tableValue.row;
});
</script>

<style scoped>
</style>
