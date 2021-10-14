<template>
  <div class="cards">
    <div class="container-sm">
      <h3 class="search-message">{{resultMessage}}</h3>
      <Card v-for="(card, i) in results" :key="i" :card="card"/>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  head() {
    return {
      title: `Результаты поиска - ${decodeURI(this.$route.query.query)}`,
    }
  },
  data() {
    return {
      results: [],
      resultMessage: ''
    }
  },
  watch: {
    '$route.query'() {
      this.search()
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    async search() {
      const route = this.$route
      const $http = this.$http
      const query = route.query.query
      if (!query) return
      let routeQuery = route.query.query.toLowerCase()
      let searchKeys = []
      if (routeQuery.includes('-')) {
        searchKeys = routeQuery.split('-')
      } else {
        searchKeys = [routeQuery]
      }

      async function fetchResult(key, query) {
        const url = `https://free-ads-d70b5-default-rtdb.firebaseio.com/posts.json?orderBy="key-${key}"&equalTo="${query}"`
        const res = await $http.get(url)
        const results = await res.json()
        return results
      }

      const resultPromises = []

      searchKeys.forEach((word, index) => {
        for (let i = 0; i < 10; i++) {
          resultPromises.push(fetchResult(i, word))
        }
      })

      const results = await Promise.all(resultPromises)
      const seen = new Set()

      this.results =
        results
          .filter(res => !!Object.keys(res).length)
          .filter(res => {
            const id = Object.values(res)[0].id
            const clone = seen.has(id)
            seen.add(id)
            return !clone
          })
          .map(res => {
            const item = Object.values(res)[0]
            const itemName = item.info.title.toLowerCase()
            let searchIndex = 0
            searchKeys.forEach(key => {
              if (itemName.includes(key)) {
                searchIndex++
              }
            })
            return { searchIndex, ...item }
          })
          .sort((a, b) => b.searchIndex - a.searchIndex)
          .filter(result => Object.keys(result).length !== 0)

      const requestQuery = decodeURI(route.query.query).split('-').join(' ')
      if (this.results.length > 0) {
        this.resultMessage = `Результаты поиска: ${requestQuery}`
      } else {
        this.resultMessage = `По запросу ${requestQuery} ничего не найдено :( `
      }
    }
  }
}
</script>
<style lang="scss">
  .search-message {
    margin: {
      top: $offset;
      bottom: 30px;
    }
    @media screen and (max-width: $screen-s) {
      margin: {
        top: $offset;
        bottom: $offset;
      }
    }
  }
</style>
