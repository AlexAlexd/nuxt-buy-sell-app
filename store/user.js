export const state = () => ({
	user: null
})

export const mutations = {
	SET_USER(state, value) {
		state.user = value
	}
}

export const getters = {
	getUser(state) {
		return state.user
	}
}