import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
	  { path: '/videos/:partnerVideoId', component: () => import('pages/VideoPage.vue') },
      { path: '/videos', component: () => import('pages/VideosPage.vue') },
      { path: '/sites', component: () => import('pages/PartnersPage.vue') },
      { path: '/sites/:partnerId', component: () => import('pages/PartnerPage.vue') },
      { path: '/tags', component: () => import('pages/TagsPage.vue') }

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
