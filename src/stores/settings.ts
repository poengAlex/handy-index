import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    nsfw: true
  }),

  getters: {
  },

  actions: {
  }
});
