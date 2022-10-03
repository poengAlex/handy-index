<template>
	<div class="q-ma-lg q-pa-lg">
		<div class="text-h3" v-if="settings.privacyAccepted">Privacy information</div>
		<div class="text-h3" v-else>Before you start using this site</div>
		<div class="text-h4">About the site</div>
		<p>This site lists all the scripts the Handy team (Sweet Tech AS) has scripted. With our browser plugin, you can
			play some videos in sync with Handy on the site.
		</p>
		<p>
			This site uses the index API. Feel free to use it for your projects, but remember that it will not be free
			to use once out of BETA.
			<a
				href="https://scripts01.handyfeeling.com/api/script/index/v0/docs/">https://scripts01.handyfeeling.com/api/script/index/v0/docs/</a>
		</p>

		<div class="text-h4">What we track</div>
		<div class="text-h5">This site</div>
		<p>
			We at Sweet Tech take privacy very seriously. We have created an internet-connected sex toy; it is
			essential.
			When creating new services, we must have user data and privacy in our spine. Our motto is a modified Golden
			rule: <i>"Track our users the way we would like to be tracked"</i> - that is, minimally or not at all.
			This site does not use cookies, and our playlists and favorites are stored in local storage. Opening this
			site
			on another device will lose these stored values. We might add a method for exporting this value from one
			device
			to another using a file. Not the best user experience, but great for your data and privacy.
		</p>
		<p>
			There is no analytics on the site. That has some consequences, like it is hard to detect errors and there
			are no
			stats on how the users interact with the site. Be kind and report any bugs or wishlist of improvements.

		</p>
		<p>
			When allowing external videos to be played on the site, you will be tracked by the external site through
			various
			analytics. When enabling NSFW, images are loaded from the different supported sites. These sites might track
			you based on the images loaded, but the tracking is less specific since it will load a lot of images at
			once. To prevent this VPN is your only real protection.
		</p>
		<p>
			This site is open source to give full transparency of whats happening on this site.
			<a href="">LINK TO GITLAB INDEX - TBD</a>
		</p>

		<div class="text-h5">The browser plugin</div>
		<p>
			The browser uses regular Handy integration. Read more about our Handy privacy here. In addition, the browser
			plugin can read the URL of the active tab. If the tab is one of the supported sites, we check with our
			database
			if we have a script to match. This query is INTRUSIVE! To give you insights on the query:
		<ul>
			<li>
				The record of the query, to check if we have a matching script, is not stored in persistent memory.
				Meaning we will not record the query in our
				databases. Logs might be stored for seven days for development purposes. In our logs, we strive to
				scramble any
				sensitive user data (IP, in this case). Since the backend code is not open source, you have to take our
				word for it.
			</li>
			<li>The browser plugin is open source to fully transparent what's happening behind the scenes.</li>
			<a href="">LINK TO GITLAB BEX - TBD</a>

			<li>We do not care what you are watching since this data would not give us much value and would increase our
				risk if we have a security breach.</li>
			<li>We only send a query on the supported sites, not every page you visit.</li>
			<li>We also use the url if you request us to script the website you are visiting. This request is stored in
				a permant database.</li>
		</ul>

		</p>

		<div class="text-h4">
			Adult content
		</div>
		<p>
			Sweet Tech AS does not store any of the videos on our servers, only the script. You are in control if you
			want
			to see images from the videos or see external videos. You can change these settings at any time from the
			menu.
		</p>
		<div class="row q-gutter-sm">
			<q-toggle v-model="settings.allowExternalVideo">Allow external videos</q-toggle>
			<q-toggle v-model="settings.nsfw">Allow adult pictures and videos.</q-toggle>
		</div>
		<q-btn v-if="!settings.privacyAccepted" class="q-mt-sm" color="warning" text-color="black" @click="accept">I
			accept understand & accept - Enter
			the site</q-btn>

	</div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "src/stores/settings";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const settings = useSettingsStore();
const router = useRouter();

function accept() {
	settings.privacyAccepted = true;
	router.push("/");
}

onMounted(() => {
	console.log('onMounted - privacy');
});
</script>

<style scoped>

</style>
