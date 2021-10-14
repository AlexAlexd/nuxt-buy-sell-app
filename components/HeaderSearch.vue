<template>
  <form @submit.prevent="onSubmit" class="search-bar">
    <input type="text" placeholder="Поиск" v-model="query" class="search-bar__field">
    <input type="submit" value="Найти" class="search-bar__btn">
  </form>
</template>
<script>
export default {
  data() {
    return {
      query: ''
    }
  },
  methods: {
    onSubmit() {
      if (!this.query.trim()) return
      const query = this.query.trim().split(' ').join('-')
      this.$router.push({ path: 'search', query: { query: encodeURIComponent(query) } })
    }
  },
  watch: {
    '$route.query': '$fetch'
  },
  fetch() {
    const query = this.$route.query.query
    if (query) {
      this.query = decodeURIComponent(query.split('-').join(' '))
    }
  }
}
</script>
<style lang="scss">
  .search-bar {
    height: 36px;
    background: white;
    border-radius: $border-radius-m;
    overflow: hidden;
    display: flex;
    margin: 0 $offset;
    width: 100%;
    max-width: 400px;
    @media screen and (max-width: $screen-s) {
      height: 26px;
      border-radius: $border-radius-s;
    }
    &__field {
      padding-left: 14px;
      width: 100%;
    }
    &__btn {
      height: 100%;
      padding: 0 $offset;
      background: rgb(235, 235, 235);
      &:hover {
        cursor: pointer;
        background: darken(rgb(235, 235, 235), 10%);
      }
    }
  }
</style>
