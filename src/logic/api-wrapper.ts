import { Store } from "pinia";
import { QVueGlobals, useQuasar } from "quasar";
import { useIndexStore } from "src/stores/apiIndex";
import { OpenAPIConfig, Partner, PartnerVideo, Script, ScriptApiIndex } from "src/_SCRIPTAPIINDEX";
import { ref } from "vue";
import { useSettingsStore } from '../stores/settings'
import { handy } from "./handy";
import { createNotify, createNotifySuccess, createNotifyWarning, showConnectionKeyDialog } from "./utils";

export let apiIndex: ScriptApiIndex;
let isInited = false;
let token = "";
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
export function initApi(_token = "") {
	if (!isInited || token !== _token) {
		console.log('initApi');

		token = _token;
		const settings = useSettingsStore()
		const config: Partial<OpenAPIConfig> = {
			HEADERS: {
				Authorization: "Bearer " + token
			},
			BASE: (API_URL.index as any)[settings.server]
		}
		apiIndex = new ScriptApiIndex(config);
		isInited = true;
	}
}

export async function downloadToken(video: PartnerVideo | undefined, $q: QVueGlobals) {
	// const handyKey = handy.getStoredKey();
	// if (handyKey === undefined) {
	// 	createNotifyWarning("You need to be connected with your Handy to download script tokens.")
	// }
	if (video === undefined) {
		createNotify("Video not defined");
		return;
	}
	const settings = useSettingsStore()
	const apiStore = useIndexStore();
	// const $q = useQuasar();
	const scripts = await apiStore.getScripts(video.partnerVideoId);
	if (settings.connectionKey === "" || settings.connectionKey === undefined) {
		showConnectionKeyDialog($q, (key: string) => {
			console.log("key:", key);
			downloadToken(video, $q);
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
	} catch (err: any) {
		console.error(err);
		console.error(JSON.stringify(err));
		console.log('err.name:', err.name);

		if (err.body && err.body.error && err.body.error.name === "UNAUTHORIZED") {
			createNotify("Your Handy needs to be connected to download a token. Is the key input correct?", "UNAUTHORIZED")
		} else {
			createNotify(err as string)
		}
	}
}
