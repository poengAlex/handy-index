import { OpenAPIConfig, Partner, ScriptApiIndex } from "src/_SCRIPTAPIINDEX";
import { ref } from "vue";

export type Server = "production" | "staging" | "dev";
const API_URL = {
    adm: {
      dev: "https://scripts01.dev.handyfeeling.com/api/script/adm/v0",
      staging: "https://scripts01.staging.handyfeeling.com/api/script/adm/v0",
      production: "https://scripts01.handyfeeling.com/api/script/adm/v0"
    },
    scripter: {
        dev: "https://scripts01.dev.handyfeeling.com/api/script/scripter/v0",
        staging: "https://scripts01.staging.handyfeeling.com/api/script/scripter/v0",
        production: "https://scripts01.handyfeeling.com/api/script/scripter/v0"
    },
    index: {
        dev: "https://scripts01.dev.handyfeeling.com/api/script/index/v0",
        staging: "https://scripts01.staging.handyfeeling.com/api/script/index/v0",
        production: "https://scripts01.handyfeeling.com/api/script/index/v0"
    }
}

const pipeline = ref({
	server: "production" as Server
});

export const partners = ref<Partner[]>([]);

// TODO: This should be optimized
export function partnerIdToPartnerName(partnerId: string) {
	// console.log('partnerIdToPartnerName', partnerId);
	let partnerName = "Unknown partner";
	partners.value.forEach(partner => {
		if (partner.partnerId === partnerId) {
			// console.log('MATCH!');
			partnerName = partner.name;
		}
	});
	return partnerName;
}

export let apiIndex: ScriptApiIndex;

export function initApi() {
    const config: Partial<OpenAPIConfig> = {
        // HEADERS: {
        //     Authorization: "Bearer " + token
        // },
        BASE: API_URL.index[pipeline.value.server]
    }
	apiIndex = new ScriptApiIndex(config);
}
