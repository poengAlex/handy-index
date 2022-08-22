<template>
	<div class="q-pa-sm">
		<Tag v-for="tag in tags" :key="tag" :tag="tag" />
	</div>
</template>

<script setup lang="ts">
import { apiIndex, initApi } from "src/logic/api-wrapper";
// import { Tag } from "src/_SCRIPTAPIINDEX";
import { onMounted, ref } from "vue";
import Tag from "src/components/Tag.vue";

const tags = ref<string[]>([]);

onMounted(async () => {
	console.log('onMounted');
	initApi();
	const _tags = await apiIndex.index.getTags();
	_tags.forEach(tag => {
		if (tag.tagId.length < 20) {
			tags.value.push(tag.tagId);
		}
	});
});
</script>

<style scoped>
</style>
