import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'
import { createNotify } from 'src/logic/utils';
import { apiIndex, initApi } from 'src/logic/api-wrapper';
import { Partner, PartnerVideo } from 'src/_SCRIPTAPIINDEX';

export const useIndexStore = defineStore('index', {
	state: () => ({
		partners: [] as Partner[]
	}),

	persist: true,
	getters: {

	},

	actions: {
		async getPartners(force = false) {
			if (this.partners.length === 0 || force) {
				initApi();
				try {
					this.partners = await apiIndex.index.getPartners();
				} catch (err) {
					console.error(err);
					createNotify(err as string);
				}
			}
			return this.partners;
		},
		getIndex() {
			initApi();
			return apiIndex.index.getIndex()
		},
		getTags() {
			initApi();
			return apiIndex.index.getTags()
		},
		getScripts(partnerVideoId: string) {
			initApi();
			return apiIndex.index.getVideoScripts(partnerVideoId);
		},
		getVideo(partnerVideoId: string) {
			initApi();
			return apiIndex.index.getVideo(partnerVideoId);
		},
		partnerIdToPartnerName(partnerId: string) {
			let partnerName = "Unknown partner";
			this.partners.forEach(partner => {
				if (partner.partnerId === partnerId) {
					// console.log('MATCH!');
					partnerName = partner.name;
				}
			});
			return partnerName;
		}
	}
});
