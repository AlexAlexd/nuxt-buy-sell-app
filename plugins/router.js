export default ({ app }) => {
	app.router.beforeEach((to, from, next) => {
		if (from.name === 'create' && to.fullPath !== '/') {
			confirm('Есть несохранённые данные, продолжить?') ? next() : next(false)
		} else {
			next()
		}
	})
}