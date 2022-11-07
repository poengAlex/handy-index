import { route } from 'quasar/wrappers'
import {
	createMemoryHistory,
	createRouter,
	createWebHashHistory,
	createWebHistory
} from 'vue-router'

import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
	const createHistory = process.env.SERVER
		? createMemoryHistory
		: (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

	const Router = createRouter({
		// scrollBehavior: () => ({ left: 0, top: 0 }),

		// Does not work due to the scroll beeing on the qTable
		// scrollBehavior(to, from, savedPosition) {
		// 	return new Promise((resolve, reject) => {
		// 		setTimeout(() => {
		// 			// resolve({ left: 0, top: 0 })
		// 			console.log("savedPosition:", savedPosition);

		// 			if (savedPosition) {
		// 				resolve(savedPosition)
		// 			} else {
		// 				return resolve({ top: 0 });
		// 			}
		// 		}, 2000)
		// 	})
		// },
		routes,

		// Leave this as is and make changes in quasar.conf.js instead!
		// quasar.conf.js -> build -> vueRouterMode
		// quasar.conf.js -> build -> publicPath
		history: createHistory(process.env.VUE_ROUTER_BASE)
	})

	return Router
})
