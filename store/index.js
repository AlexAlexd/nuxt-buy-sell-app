export const actions = {
	async nuxtServerInit({ commit }, { app }) {
		const uid = this.$cookies.get('uid')

		const res = await app.$http.get(`https://free-ads-d70b5-default-rtdb.firebaseio.com/users/${uid}.json`)
		const user = await res.json()
		if (user) {
			commit('user/SET_USER', user)
		}
	}
}