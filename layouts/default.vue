<template>
  <div>
    <Header/>
    <div class="default">
      <nuxt keep-alive/>
    </div>
  </div>
</template>
<style lang="scss">
  .container {
    max-width: 1440px;
    width: 100%;
    padding: 0 16px;
    margin: 0 auto;
  }
  .default {
    margin-top: 60px;
    overflow: hidden;
    @media screen and (max-width: $screen-s) {
      margin-top: 44px;
    }
  }
</style>
