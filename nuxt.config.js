export default {
	env: {
		APP_TITLE: 'Бесплатные обьявления'
	},
	head() {
		return {
			title: process.env.APP_TITLE,
			htmlAttrs: {
				lang: 'en'
			},
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ hid: 'description', name: 'description', content: 'Бесплатное размещение обьявлений о продаже по всей Украине. Сайт Бесплатные обьявления' },
				{ name: 'format-detection', content: 'telephone=no' }
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
			]
		}
	},
	css: [
		'~/assets/vars.scss',
		'~/assets/main.scss',
		'~/assets/classes.scss',
		'~/assets/mixins.scss',
		'vue-slick-carousel/dist/vue-slick-carousel.css',
		'vue-slick-carousel/dist/vue-slick-carousel-theme.css',
	],
	components: true,
	plugins: [
		{ src: '~/plugins/v-mask.js', mode: 'client' },
		{ src: '~/plugins/simple-validator.js', ssr: true },
		{ src: '~/plugins/router.js', mode: 'client' },
		{ src: '~/plugins/vue-slick-carousel.js', mode: 'all' },
		{ src: '~/plugins/sendMessage.js' }
	],
	modules: ['@nuxt/http', '@nuxtjs/firebase', 'cookie-universal-nuxt'],
	buildModules: ['@nuxtjs/style-resources'],
	styleResources: {
		scss: [
			'./assets/vars.scss',
			'./assets/mixins.scss'
		]
	},
	firebase: {
		config: {
			apiKey: "AIzaSyCmTdi0626JnTf_sCAMUc2VmvwXcxwtBC4",
			authDomain: "free-ads-d70b5.firebaseapp.com",
			databaseURL: "https://free-ads-d70b5-default-rtdb.firebaseio.com",
			projectId: "free-ads-d70b5",
			storageBucket: "free-ads-d70b5.appspot.com",
			messagingSenderId: "284842415017",
			appId: "1:284842415017:web:1c9339879a19db42956ab8"
		},
		services: {
			auth: true,
			database: true,
			storage: true
		}
	}
}
