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
	<div class="text-h4 q-mt-md">
		Install the browser extension
	</div>
	<p>
		Google blocked the extension from being available on the Chrome web store. You can still install it manually
		by following these steps <a href="https://github.com/poengAlex/handy-browser-extension/releases/tag/1.0.0"
			target="_BLANK">here</a>.
	</p>
	<div class="text-h4 q-mt-md">
		Get your videos scripted
	</div>
	<p>
		Add a request here on this page. The videos with the most requests will be scripted first.
	</p>
	<div class="text-h4">
		Known errors
	</div>
	<ul>

		<li>Older versions of the browser extension does not work correctly. Try to uninstall the extension and install
			it again.</li>
		<li>IVDB.io does not work if you are translating the page! Turn off translation to get it working. You might
			need to set english as the preferred language as well. See image:
			<br>
			<q-img src="chrome_settings.jpg" alt="Chrome settings" style="max-width: 800px;" />
		</li>

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

<style scoped></style>
