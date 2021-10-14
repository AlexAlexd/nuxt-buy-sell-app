export default function ({ query, route, redirect }) {
	if (query.edit && !route.params.post) {
		redirect('/profile')
	}
}