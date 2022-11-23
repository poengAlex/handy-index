<template>
	<div class="text-h3">
		Help & Feedback
	</div>
	<q-banner class="bg-warning text-black">
		<template v-slot:avatar>
			<q-icon name="warning" color="black" />
		</template>
		This page is not complete
	</q-banner>
	<div class="text-h4">
		Known errors
	</div>
	<ul>
		<li>IVDB.io does not work if you are translating the page! Turn off translation to get it working.</li>
		<li>Older versions of the browser extension does not work correctly. Try to uninstall the extension and install
			it again.</li>
	</ul>

	<p>
		For further feedback. Please reach out on our <a href="https://discord.com/invite/sTtnmW2XvZ">Discord
			channel</a>.
	</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

onMounted(() => {
	console.log('onMounted');
});
</script>

<style scoped>

</style>
