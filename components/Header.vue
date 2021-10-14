<template>
  <div class="header">
    <div class="container">
      <nuxt-link to="/">Главная</nuxt-link>
      <HeaderSearch/>
      <nuxt-link to="/profile" v-if="user">Профиль</nuxt-link>
      <nuxt-link to="/auth" v-else>Войти/Регистрация</nuxt-link>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({ user: 'user/getUser' })
  }
}
</script>
<style lang="scss">
  .header {
    position: fixed;
    height: 60px;
    left: 0;
    right: 0;
    top: 0;
    font-weight: $font-weight-sb;
    background: $header-bg;
    color: white;
    z-index: 100;
    @media screen and (max-width: $screen-s) {
      height: 44px;
    }
    & > .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 $offset-m;
    }
  }
</style>
