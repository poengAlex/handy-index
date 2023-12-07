<template>
	<div class="q-ma-lg q-pa-lg">
		<div class="text-h3" v-if="settings.privacyAccepted">Privacy information</div>
		<div class="text-h3" v-else>Before you start using this site</div>
		<div class="text-h4">About the site</div>
		<p>This site lists all the scripts the Handy team (Sweet Tech AS) has scripted. With our browser plugin, you can
			play some videos in sync with Handy on the site. The site and public tokens are free for Handy users to use
			for the time being. We do not expect this to change in a year or two. But we want to give a heads up that we
			might put a small fee on it way into the future.
		</p>
		<p>
			This site uses the index API. Feel free to use it for your projects:
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
			<a href="https://github.com/poengAlex/handy-index" target="_blank">Github repo of the index site</a>
		</p>
		<template v-if="false">
			<div class="text-h5">The browser plugin</div>
			<p>
				The browser uses regular Handy integration. Read more about our Handy privacy <a
					href="https://www.thehandy.com/company/blog/online-connection-privacy-concerns-and-the-handy"
					target="_blank">here</a>. In addition, the browser
				plugin can read the URL of the active tab. If the tab is one of the supported sites, we check with our
				database
				if we have a script to match. This query is INTRUSIVE! To give you insights on the query:
				<br><br><b>NB! We removed the ability to read a URL for now. You must go to the index site and manually
					request
					the
					URL. We might change it back to be able to read the URL, but it felt wrong to read the URLs even if we
					did
					not use it.</b>
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
				<a href="https://github.com/poengAlex/handy-browser-extension" target="_blank">Github repo of the browser
					extension</a>

				<li>We do not care what you are watching since this data would not give us much value and would increase our
					risk if we have a security breach.</li>
				<li>We only send a query on the supported sites, not every page you visit.</li>
				<li>We also use the url if you request us to script the website you are visiting. This request is stored in
					a permanent database.</li>
			</ul>

			</p>
		</template>

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
			understand & accept - Enter
			the site</q-btn>

	</div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "src/stores/settings";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const settings = useSettingsStore();
const router = useRouter();
const route = useRoute();

function accept() {
	settings.privacyAccepted = true;
	if (route.query.redirect) {
		router.push(route.query.redirect as string);
	} else {
		router.push("/");
	}
}

onMounted(() => {
	console.log('onMounted - privacy');
	console.log("route.query.redirect:", route.query.redirect);
});
</script>

<style scoped></style>
