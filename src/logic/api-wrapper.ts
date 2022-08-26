import { OpenAPIConfig, Partner, PartnerVideo, ScriptApiIndex } from "src/_SCRIPTAPIINDEX";
import { ref } from "vue";
import { useSettingsStore } from '../stores/settings'
import { handy } from "./handy";
import { createNotify, createNotifySuccess, createNotifyWarning } from "./utils";

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
