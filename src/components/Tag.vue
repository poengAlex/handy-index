<template>
	<span @click.stop="onTagClick" class=" cursor-pointer">
		<q-chip class="q-ma-none q-ml-xs q-mb-xs" size="sm" color="black" text-color="white">
			<q-avatar v-if="props.count !== 0 && props.count !== undefined" color="red" text-color="white">
				{{ props.count }}</q-avatar>
			{{ props.tag }}
		</q-chip>
	</span>
</template>

<script setup lang="ts">

import { useRouter } from "vue-router";
const props = defineProps(['tag', 'count']);
const router = useRouter();
function onTagClick() {
	console.log('Tag click. Tag:', props.tag);
	router.push({
		path: "/videos",
		query: {
			tag: props.tag
		}
	})
}
</script>
