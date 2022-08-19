import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'
import { Partner } from 'src/_SCRIPTAPIINDEX';

export type Server = "production" | "staging" | "dev";

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    nsfw: useStorage("nsfw", false),
    server: useStorage("server", "production" as Server),
    partners: useStorage("partners", [] as Partner[])
  }),

  getters: {
  },

  actions: {
  }
});
