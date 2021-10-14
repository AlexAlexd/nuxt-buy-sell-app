<template>
  <div class="user-posts">
    <h3 v-if="showPlug" class="no-items-plug">Нет обьявлений</h3>
    <Card
      v-for="(card, i) in posts"
      :key="i"
      :index="i"
      :card="card"
      :isEditable="true"
      @edit="editPost"
      @delete="deletePost"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      posts: [],
      showPlug: false
    }
  },
  async mounted() {
    this.fetchPosts()
  },
  methods: {
    async fetchPosts() {
      const postsRequest = await this.$fire.database.ref(`users/${this.user.uid}/posts`).get()
      const result = postsRequest.val()

      if (!result) {
        this.showPlug = true
        return
      }
      const keys = Object.keys(result)

      for await (const key of keys) {
        const res = await this.$fire.database.ref(`posts/${key}`).get()
        const data = res.val()
        this.posts.push(data)
      }
    },
    async deletePost(post) {
      if (!confirm(`Вы уверенны что хотите удалить ${post.info.title}?`)) return
      const postId = post.info.id

      const postRef = this.$fire.database.ref(`posts/${postId}`)
      await postRef.set(null)

      const userPostRef = this.$fire.database.ref(`users/${this.user.uid}/posts/${postId}`)
      await userPostRef.set(null)

      const imagesIds = Object.keys(post.images)
      for await (const imageId of imagesIds) {
        const postImagesRef = this.$fire.storage.ref(`images/posts/${postId}/${imageId}`)
        await postImagesRef.delete()
      }

      const idx = this.posts.indexOf(post)
      this.posts.splice(idx, 1)
    },
    editPost(key) {
      const post = this.findPost(key)

      this.$router.push({ name: 'create', params: { post }, query: { edit: true } })
    }
  },
  computed: {
    findPost() {
      return key => this.posts.find(post => post.info.id === key)
    },
    ...mapGetters({ user: 'user/getUser' }),
  },
  watch: {
    user(val) {
      if (!val) return
      this.showPlug = false
      this.posts = []
      this.fetchPosts()

    }
  },
}
</script>

<style lang="scss">
  .user-posts {
    display: flex;
    flex-wrap: wrap;
  }
</style>
