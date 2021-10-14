// const postId = postRef.key
// dispatch('saveUserPost', postId)
// const res = await fetch(`https://free-ads-d70b5-default-rtdb.firebaseio.com/posts/${postId}.json`)
// const data = await res.json()
// console.log(data)
// async saveUserPost({ rootGetters }, id) {
// 	const uid = rootGetters['user/getUser'].uid
// 	const userRef = this.$fire.database.ref(`/users/${uid}`)

// 	userRef.child('posts').push().set({ id })
// }