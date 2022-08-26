import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'
import { Partner, PartnerVideo } from 'src/_SCRIPTAPIINDEX';
import { createNotify, createNotifyWarning } from 'src/logic/utils';
import { apiIndex, initApi } from 'src/logic/api-wrapper';

export type Server = "production" | "staging" | "dev";

export const useSettingsStore = defineStore('settings', {
	state: () => ({
		server: "production" as Server,
		nsfw: false,
		connectionKey: "",
		allowExternalVideo: false,
		favorites: [] as PartnerVideo[]
	}),
	persist: true,
	getters: {

	},

	actions: {
		isFav(video: PartnerVideo) {
			console.log('is match?', video);

			let match = false;
			this.favorites.forEach(_video => {
				if (_video.partnerVideoId === video.partnerVideoId) {
					match = true;
				}
			});
			return match;
		},
		addToFav(video: PartnerVideo | undefined) {
			console.log('addToFav', video);
			if (video === undefined) {
				createNotifyWarning("video is undefined");
				return;
			}
			if (!this.isFav(video)) {
				this.favorites.push(video);
			} else {
				console.warn("Already in fav");
			}
		},
		removeFromFav(video: PartnerVideo | undefined) {
			console.log('removeFromFav', video);
			if (video === undefined) {
				createNotifyWarning("video is undefined");
				return;
			}
			if (this.isFav(video)) {
				this.favorites.forEach((_video, index) => {
					if (_video.partnerVideoId === video.partnerVideoId) {
						console.log('Match. Removing');
						this.favorites.splice(index, 1);
					}
				});
			} else {
				console.warn("This video is not in fav");
			}
		}
	}
});
