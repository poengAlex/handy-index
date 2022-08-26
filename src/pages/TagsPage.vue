<template>
	<div class="q-pa-sm">
		<TagVue v-for="tag in tags" :key="tag.tagId" :tag="tag.tagId" :count="tag.count" />
	</div>
</template>

<script setup lang="ts">
// import { apiIndex, initApi } from "src/logic/api-wrapper";
// import { Tag } from "src/_SCRIPTAPIINDEX";
import { onMounted, ref } from "vue";
import TagVue from "src/components/Tag.vue";
import { useIndexStore } from 'src/stores/apiIndex';
import { Tag } from "src/_SCRIPTAPIINDEX";
const indexStore = useIndexStore();

const tags = ref<Tag[]>([]);

onMounted(async () => {
	console.log('onMounted');
	const _tags = await indexStore.getTags();
	_tags.forEach(tag => {
		if (tag.tagId.length < 20) {
			tags.value.push(tag);
		}
	});
});
</script>

<style scoped>
</style>
