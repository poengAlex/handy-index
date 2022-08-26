<template>
	<q-banner class="bg-warning text-black">
		<template v-slot:avatar>
			<q-icon name="warning" color="black" />
		</template>
		This feature will come soon...
	</q-banner>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

onMounted(() => {
	console.log('onMounted - playlist');
});
</script>

<style scoped>
</style>
