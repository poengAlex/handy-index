import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'
import { Partner } from 'src/_SCRIPTAPIINDEX';
import { createNotify } from 'src/logic/utils';
import { apiIndex, initApi } from 'src/logic/api-wrapper';

export type Server = "production" | "staging" | "dev";

export const useSettingsStore = defineStore('settings', {
  state: () => ({
	server: useStorage("server", "production" as Server),
    nsfw: useStorage("nsfw", false)
  }),

  getters: {

  },

  actions: {

  }
});
