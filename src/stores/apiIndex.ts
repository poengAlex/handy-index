import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'
import { createNotify } from 'src/logic/utils';
import { apiIndex, initApi } from 'src/logic/api-wrapper';
import { Partner } from 'src/_SCRIPTAPIINDEX';

export const useIndexStore = defineStore('index', {
	state: () => ({
		partners: useStorage("partners", [] as Partner[])
	}),

	getters: {

	},

	actions: {
		async getPartners() {
			if (this.partners === undefined) {
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
		async getIndex() {
			initApi();
			return apiIndex.index.getIndex()
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
