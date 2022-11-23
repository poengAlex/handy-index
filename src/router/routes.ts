import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/IndexPage.vue') },
			{ path: '/videos/:partnerVideoId', component: () => import('pages/VideoPage.vue') },
			{ path: '/videos', component: () => import('pages/VideosPage.vue') },
			{ path: '/favorites', component: () => import('pages/VideosPage.vue'), meta: { fav: true } },
			{ path: '/sites', component: () => import('pages/PartnersPage.vue') },
			{ path: '/sites/:partnerId', component: () => import('pages/PartnerPage.vue') },
			{ path: '/tags', component: () => import('pages/TagsPage.vue') },
			{ path: '/playlists', component: () => import('pages/PlaylistPage.vue') },
			{ path: '/privacy', name: "privacy", component: () => import('pages/PrivacyPage.vue') },
			{ path: '/performers', name: "performers", component: () => import('pages/PerformersPage.vue') },
			{ path: '/request', name: "request", component: () => import('pages/RequestPage.vue') },
			{ path: '/help', name: "help", component: () => import('pages/HelpPage.vue') }

		]
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue')
	}
];

export default routes;
