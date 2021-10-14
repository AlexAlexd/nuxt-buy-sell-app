<template>
  <div class="container-sm">
    <div class="cards">
      <Card v-for="(card, i) in posts" :key="i" :card="card"/>
    </div>
    <div v-if="posts">
      <button
        @click="loadMore"
        class="cards__more btn-primary"
        v-if="posts.length === itemsAmount - 1"
      >Загрузить ещё</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      posts: null,
      itemsAmount: 17,
      lastId: null
    }
  },
  methods: {
    async loadMore() {
      const postsRef = this.$fire.database.ref('posts')
      let res = null
      const localPosts = JSON.parse(JSON.stringify(!!this.posts))

      if (localPosts) {
        res = await postsRef.orderByChild('id').startAt(this.lastId).limitToFirst(this.itemsAmount).once('value')
        this.posts = [...this.posts]
      } else {
        res = await postsRef.orderByChild('id').limitToFirst(this.itemsAmount).once('value')
        this.posts = []
      }
      let data = res.val()
      if (data) {
        data = Object.values(res.val())
      } else {
        return
      }

      const lastItemId = data[data.length - 1].id
      this.lastId = lastItemId

      const actualPosts = data.slice(0, JSON.parse(JSON.stringify(this.itemsAmount)) - 1)

      if (localPosts && this.posts[this.posts.length - 1].id === actualPosts[0].id) return

      actualPosts.forEach(post => {
        this.posts.push(post)
      })
    }
  },
  async mounted() {
    this.loadMore()
  }
}
</script>
<style lang="scss">
  .cards {
    padding-bottom: 50px;
    display: flex;
    flex-wrap: wrap;
    &__more {
      margin: $offset auto 0 auto;
    }
  }
</style>
