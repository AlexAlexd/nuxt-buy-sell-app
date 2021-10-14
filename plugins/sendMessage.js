import Vue from 'vue'
Vue.mixin({
	methods: {
		async sendMessage(firebase, text, uid, chatKey, url) {
			const messagesRef = firebase.database.ref(`chats/${chatKey}/messages`).push()
			let message = null
			const date = new Date();
			const formatNum = num => num < 10 ? `0${num}` : num
			const time = `${formatNum(date.getHours())}:${formatNum(date.getMinutes())}`

			if (url) {
				message = { url, uid, time }
			} else {
				message = { text, uid, time }
			}
			await messagesRef.set(message)
		},
	}
})