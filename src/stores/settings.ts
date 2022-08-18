import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    nsfw: false
  }),

  getters: {
  },

  actions: {
  }
});
