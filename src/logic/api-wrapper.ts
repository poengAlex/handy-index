import { useQuasar } from "quasar";
import { useIndexStore } from "src/stores/apiIndex";
import { OpenAPIConfig, Partner, PartnerVideo, Script, ScriptApiIndex } from "src/_SCRIPTAPIINDEX";
import { ref } from "vue";
import { useSettingsStore } from '../stores/settings'
import { handy } from "./handy";
import { createNotify, createNotifySuccess, createNotifyWarning, showConnectionKeyDialog } from "./utils";

export let apiIndex: ScriptApiIndex;
const TUBE_SITES_PARTNERS = ["pornhub.com"];

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

// TODO: Could this be called somewher global place?
export function initApi(token = "") {
	const settings = useSettingsStore()
	const config: Partial<OpenAPIConfig> = {
		HEADERS: {
			Authorization: "Bearer " + token
		},
		BASE: (API_URL.index as any)[settings.server]
	}
	apiIndex = new ScriptApiIndex(config);
}

export async function downloadToken(video: PartnerVideo) {
	// const handyKey = handy.getStoredKey();
	// if (handyKey === undefined) {
	// 	createNotifyWarning("You need to be connected with your Handy to download script tokens.")
	// }
	const settings = useSettingsStore()
	const apiStore = useIndexStore();
	const $q = useQuasar();
	const scripts = await apiStore.getScripts(video.partnerVideoId);
	if (settings.connectionKey === "") {
		showConnectionKeyDialog($q, (key: string) => {
			console.log("key:", key);
			downloadToken(video);
		});
		return;
	}
	initApi(settings.connectionKey);
	// console.log('downloadToken', video);
	try {
		const script = scripts[0];
		const token = await apiIndex.index.getTokenUrl(video.partnerVideoId, script.scriptId);
		console.log("token:", token);
		window.open(token.url, "_blank");
		createNotifySuccess("Downloading token")
	} catch (err) {
		console.error(err);
		createNotify(err as string)
	}
}
