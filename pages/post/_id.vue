<template>
  <div class="post container-sm">
    <button class="btn-primary back-btn" @click="$router.go(-1)">Назад</button>
    <div class="post__header">
      <VueSlickCarousel v-bind="settings">
        <img
          class="post__image"
          :src="img.url"
          :alt="img.name"
          v-for="(img ,i) in Object.values(post.images)"
          :key="i"
        >
      </VueSlickCarousel>
    </div>
    <div class="post__body">
      <h1 class="post__name">{{post.info.title}}</h1>
      <h3 class="post__price">{{post.info.price}}</h3>
      <p class="post__description">{{post.info.description}}</p>
    </div>
    <div class="post__author">
      <div class="post__author-image">
        <img :src="post.author.imageURL">
      </div>
      <div class="post__author-name">{{post.author.name}}</div>
      <div class="post__author-city">{{post.author.city}}</div>
      <BasePhoneWrapper :phone="post.author.phoneNumber"/>
      <BaseMessageBox v-if="canMessage" :author="post.author"/>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  head() {
    return {
      title: `${this.post.info.title} - ${this.post.info.price}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `
		  ${this.post.info.description}, 
		  Обьявление: ${this.post.info.title}, 
		  Цена: ${this.post.info.price}
		  Автор:${this.post.author.name}
		  `
        }
      ]
    }
  },
  layout: 'simple',
  data() {
    return {
      canMessage: true,
      settings: {
        "dots": true,
        "infinite": false,
        fade: true,
        adaptiveHeight: true
      }
    }
  },
  async asyncData({ query, $http }) {
    const post = await $http.$get(`https://free-ads-d70b5-default-rtdb.firebaseio.com/posts/${query.id}.json`)
    return { post }
  },
  computed: {
    ...mapGetters({ user: 'user/getUser' })
  },
  mounted() {
    if (this.user) {
      if (this.user.uid === this.post.author.uid) {
        this.canMessage = false
      }
    } else {
      this.canMessage = false
    }
  }
}
</script>
<style lang="scss">
  .slick-arrow {
    &:before {
      opacity: 1;
      color: black;
    }
  }
  .post {
    padding-bottom: 100px;
    &__header {
      max-width: 400px;
      margin: auto;
      padding: 0 30px;
      max-height: 100vh;
      overflow: hidden;
    }
    &__image {
      &.landscape {
        width: 100%;
        height: auto;
      }
      &.portrait {
        width: auto;
        height: 100%;
      }
    }
    &__body {
      margin-top: $offset-m;
      @media screen and (max-width: $screen-s) {
        margin-top: $offset;
      }
    }
    &__name {
      margin-top: $offset-m;
      font-size: $font-size-l;
      font-weight: $font-weight-r;
    }
    &__price {
      font-size: $font-size-l;
      margin-top: $offset;
    }
    &__description {
      margin-top: $offset;
    }
    &__author {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 30px;
      &-image {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        background: #ccc;
        & > img {
          height: 100%;
          width: auto;
        }
      }
      &-name {
        font-size: $font-size-m;
      }
    }
  }
</style>
