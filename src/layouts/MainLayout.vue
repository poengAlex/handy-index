<template>
	<q-layout view="lHh Lpr fff" class="bg-grey-1 ">
		<q-header elevated class="bg-white text-grey-8" height-hint="64">
			<q-toolbar class="GPL__toolbar" style="height: 64px">
				<q-btn flat dense round @click="toggleLeftDrawer" aria-label="Menu" icon="menu" class="q-mx-md" />

				<q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap cursor-pointer"
					@click="router.push('/')">
					<svg width="15" height="29" viewBox="0 0 21 29" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M4.94359 29C3.63375 28.9958 2.37874 28.4626 1.45253 27.5169C0.526327 26.5712 0.00415282 25.2897 0 23.9523V5.04773C0.00415282 3.7103 0.526327 2.42885 1.45253 1.48313C2.37874 0.537416 3.63375 0.00424031 4.94359 0C6.25344 0.00424031 7.50845 0.537416 8.43465 1.48313C9.36086 2.42885 9.88303 3.7103 9.88719 5.04773V23.9523C9.89403 26.7278 7.66188 29 4.94359 29Z"
							fill="#616161" />
						<path
							d="M16.0564 12.067C14.7465 12.0713 13.4915 12.6044 12.5653 13.5501C11.6391 14.4959 11.1169 15.7773 11.1128 17.1147V28.4896H21V17.1147C20.9958 15.7773 20.4737 14.4959 19.5475 13.5501C18.6212 12.6044 17.3662 12.0713 16.0564 12.067Z"
							fill="#616161" />
					</svg>

					<span class="q-ml-xs headerName">Script
						Index</span>
				</q-toolbar-title>

				<q-space />

				<!-- <q-input class="GPL__toolbar-input" dense standout="bg-primary" v-model="search" placeholder="Search">
					<template v-slot:prepend>
						<q-icon v-if="search === ''" name="search" />
						<q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
					</template>
				</q-input> -->

				<!-- <q-btn v-if="$q.screen.gt.xs" flat dense no-wrap color="primary" icon="add" no-caps label="Create"
					class="q-ml-sm q-px-md">
					<q-menu anchor="top end" self="top end">
						<q-list class="text-grey-8" style="min-width: 100px">
							<q-item aria-hidden="true">
								<q-item-section class="text-uppercase text-grey-7" style="font-size: 0.7rem">Create New
								</q-item-section>
							</q-item>
							<q-item v-for="menu in createMenu" :key="menu.text" clickable v-close-popup
								aria-hidden="true">
								<q-item-section avatar>
									<q-icon :name="menu.icon" />
								</q-item-section>
								<q-item-section>{{ menu.text }}</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</q-btn> -->

				<!-- <q-btn v-if="$q.screen.gt.xs" flat dense no-wrap color="primary" icon="cloud_upload" no-caps
					label="Upload" class="q-ml-sm q-px-md" /> -->

				<q-space />

				<div class="q-gutter-sm row items-center no-wrap">
					<div id="handy-ui"></div>
					<!-- <q-btn round dense flat color="text-grey-7" icon="apps">
						<q-tooltip>Google Apps</q-tooltip>
					</q-btn>
					<q-btn round dense flat color="grey-8" icon="notifications">
						<q-badge color="red" text-color="white" floating>
							2
						</q-badge>
						<q-tooltip>Notifications</q-tooltip>
					</q-btn>
					<q-btn round flat>
						<q-avatar size="26px">
							<img src="https://cdn.quasar.dev/img/boy-avatar.png">
						</q-avatar>
						<q-tooltip>Account</q-tooltip>
					</q-btn> -->
				</div>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="leftDrawerOpen" bordered behavior="mobile" @click="leftDrawerOpen = false">
			<q-scroll-area class="fit ">
				<q-toolbar class="GPL__toolbar">
					<q-toolbar-title class="row items-center text-grey-8">
						<svg width="15" height="29" viewBox="0 0 21 29" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M4.94359 29C3.63375 28.9958 2.37874 28.4626 1.45253 27.5169C0.526327 26.5712 0.00415282 25.2897 0 23.9523V5.04773C0.00415282 3.7103 0.526327 2.42885 1.45253 1.48313C2.37874 0.537416 3.63375 0.00424031 4.94359 0C6.25344 0.00424031 7.50845 0.537416 8.43465 1.48313C9.36086 2.42885 9.88303 3.7103 9.88719 5.04773V23.9523C9.89403 26.7278 7.66188 29 4.94359 29Z"
								fill="#616161" />
							<path
								d="M16.0564 12.067C14.7465 12.0713 13.4915 12.6044 12.5653 13.5501C11.6391 14.4959 11.1169 15.7773 11.1128 17.1147V28.4896H21V17.1147C20.9958 15.7773 20.4737 14.4959 19.5475 13.5501C18.6212 12.6044 17.3662 12.0713 16.0564 12.067Z"
								fill="#616161" />
						</svg>
						<span class="q-ml-sm headerName">Script index</span>
					</q-toolbar-title>
				</q-toolbar>

				<q-list padding>
					<q-item v-for="(link, index) in links" :key="index" clickable class="GPL__drawer-item"
						:to="link.link">
						<q-item-section avatar>
							<q-icon :name="link.icon" />
						</q-item-section>
						<q-item-section>
							<q-item-label>{{ link.text }}</q-item-label>
						</q-item-section>
					</q-item>

					<q-separator class="q-my-md" />

					<q-item v-for="link in links3" :key="link.text" clickable class="GPL__drawer-item"
						@click="link.route !== undefined ? router.push(link.route) : createNotifyWarning('Not implemented!')">
						<q-item-section avatar>
							<q-icon :name="link.icon" />
						</q-item-section>
						<q-item-section>
							<q-item-label>{{ link.text }}</q-item-label>
						</q-item-section>
					</q-item>
					<q-item clickable class="GPL__drawer-item" @click="clearAllData">
						<q-item-section avatar>
							<q-icon name="delete" />
						</q-item-section>
						<q-item-section>
							<q-item-label>Clear all data</q-item-label>
						</q-item-section>
					</q-item>

					<q-separator class="q-my-md" />
					<q-item clickable class="GPL__drawer-item GPL__drawer-item--storage">
						<q-item-section avatar>
							<q-icon name="visibility" />
						</q-item-section>
						<q-item-section top>
							<!-- <q-item-label>NSFW</q-item-label> -->
							<q-toggle v-model="settings.nsfw">NSFW</q-toggle>
						</q-item-section>
					</q-item>
					<q-item clickable class="GPL__drawer-item GPL__drawer-item--storage">
						<q-item-section avatar>
							<q-icon name="preview" />
						</q-item-section>
						<q-item-section top>
							<q-toggle v-model="settings.allowExternalVideo">External videos</q-toggle>
						</q-item-section>
					</q-item>
					<q-item clickable @click="showConnectionKeyDialog($q)"
						class="GPL__drawer-item GPL__drawer-item--storage">
						<q-item-section avatar>
							<q-icon name="key" />
						</q-item-section>
						<q-item-section top>
							<q-item-label>Connection key</q-item-label>
							<q-item-label caption>{{ settings.connectionKey }}</q-item-label>
						</q-item-section>
					</q-item>
					<q-item clickable class="GPL__drawer-item GPL__drawer-item--storage hidden">
						<q-item-section avatar>
							<q-icon name="cloud" />
						</q-item-section>
						<q-item-section top>
							<q-item-label>Storage</q-item-label>
							<q-linear-progress :value="storage" class="q-my-sm" />
							<q-item-label caption>2.6 GB of 15 GB</q-item-label>
						</q-item-section>
					</q-item>
				</q-list>
			</q-scroll-area>
		</q-drawer>

		<q-page-container class="GPL__page-container ">
			<q-page class="_container q-pa-sm ">
				<router-view />
			</q-page>

			<q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
				<div class="fit q-pt-xl q-px-sm column">
					<q-btn v-for="(link, index) in links" :key="index" round flat color="grey-8" stack no-caps
						size="26px" class="GPL__side-btn" :to="link.link">
						<q-icon size="22px" :name="link.icon" />
						<div class="GPL__side-btn__label">{{ link.text }}</div>
						<q-badge v-if="link.badge" floating color="red" text-color="white"
							style="top: 8px; right: 16px">
							{{ link.badge }}
						</q-badge>
					</q-btn>
				</div>
			</q-page-sticky>
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { initApi } from 'src/logic/api-wrapper';
import { createNotifySuccess, createNotifyWarning, showConnectionKeyDialog } from 'src/logic/utils';
// import { initHandy } from 'src/logic/handy';
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useSettingsStore } from '../stores/settings'
const settings = useSettingsStore()
const leftDrawerOpen = ref(false)
const router = useRouter();
const storage = ref(0.26)
const search = ref('');
const $q = useQuasar();

const links3 = [
	{ icon: 'settings', text: 'Settings' },
	{ icon: 'help', text: 'Help & Feedback' },
	{ icon: 'get_app', text: 'App Downloads' },
	{ icon: 'policy', text: 'Privacy information', route: "/privacy" }
]

const links = ref<{ text: string, link: string, badge?: string, icon: string }[]>([
	{
		text: "Videos",
		link: "/videos",
		icon: "movie"
	},
	{
		text: "Sites",
		link: "/sites",
		icon: "public",
		badge: "1"
	},
	{
		text: "Tags",
		link: "/tags",
		icon: "sell"
	},
	{
		text: "Favorites",
		link: "/favorites",
		icon: "favorite"
	},
	{
		text: "Requests",
		link: "/request",
		icon: "poll"
	},
	{
		text: "Playlists",
		link: "/playlists",
		icon: "collections_bookmark",
		badge: "Soon"
	}
])

function clearAllData() {
	localStorage.clear();
	createNotifySuccess("Data cleared");
	location.reload();
}

function toggleLeftDrawer() {
	leftDrawerOpen.value = !leftDrawerOpen.value
}

router.beforeEach(async (to, from) => {
	if (!settings.privacyAccepted && to.name !== "privacy") {
		console.warn("privacy intro not seen");
		router.push({ path: "/privacy" });
		createNotifyWarning("Please accept our terms before using the site");
	}
})

onBeforeMount(() => {
	if (!settings.privacyAccepted) {
		console.warn("privacy intro not seen");
		router.push({ path: "/privacy" })
	}
})

onMounted(() => {
	// initHandy();
})
</script>

<style lang="sass">
.headerName
	padding-left: 2px
	padding-top: 4px
	font-size: 26px
.GPL
	&__toolbar
		height: 64px
	&__toolbar-input
		width: 35%
	&__drawer-item
		line-height: 24px
		border-radius: 0 24px 24px 0
		margin-right: 12px
	.q-item__section--avatar
		padding-left: 12px
		.q-icon
			color: #5f6368
	.q-item__label:not(.q-item__label--caption)
		color: #3c4043
		letter-spacing: .01785714em
		font-size: .875rem
		font-weight: 500
		line-height: 1.25rem
	&--storage
		border-radius: 0
		margin-right: 0
		padding-top: 24px
		padding-bottom: 24px
	&__side-btn
		&__label
			font-size: 12px
			line-height: 24px
			letter-spacing: .01785714em
			font-weight: 500
	@media (min-width: 1024px)
		&__page-container
			padding-left: 94px
</style>
