<template>
	<div @click="onTagClick" class=" col-auto cursor-pointer">
		<q-chip class="q-ma-none q-ml-xs q-mb-xs" dense color="black" text-color="white">
			{{ props.tag }}</q-chip>
	</div>
</template>

<script setup lang="ts">

import { useRouter } from "vue-router";
const props = defineProps(['tag']);
const router = useRouter();
function onTagClick() {
	console.log('Tag click. Tag:', props.tag);
}
</script>
