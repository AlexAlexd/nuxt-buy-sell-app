<template>
  <div class="card">
    <nuxt-link
      :to="{ path: `post/${transformUrl(card.info.title)}`, query: { id: card.info.id } }"
      class="card__name"
    >
      <div class="card__image">
        <img
          :src="Object.values(card.images)[0].url"
          alt="product image"
          ref="img"
          @load="onImageLoad"
          :class="{ hide: isImageHide, [imageClass]: true }"
        >
      </div>
    </nuxt-link>
    <div class="card__info">
      <nuxt-link
        :to="{ path: `post/${transformUrl(card.info.title)}`, query: { id: card.info.id } }"
        class="card__name"
      >{{card.info.title}}</nuxt-link>
      <div class="card__location">{{card.info.city}}</div>
      <div class="card__price">{{card.info.price}}</div>
    </div>
    <div class="card__controls" v-if="isEditable">
      <button class="btn-primary" @click="emitEdit">Редактировать</button>
      <button class="btn-primary color-red" @click="emitDelete">Удалить</button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    card: {
      type: Object
    },
    isEditable: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number
    }
  },
  emits: ['edit', 'delete'],
  data() {
    return {
      isImageHide: false,
      imageClass: ''
    }
  },
  methods: {
    transformUrl(name) {
      return name.split(' ').join('-').toLowerCase()
    },
    onImageLoad(e) {
      const img = this.$refs.img
      this.isImageHide = false
      const el = e.currentTarget
      this.imageClass = el.height > el.width ? 'portrait' : 'landscape'
    },
    emitEdit() {
      this.$emit('edit', this.card.info.id)
    },
    emitDelete() {
      this.$emit('delete', this.card)
    }
  },
  mounted() {
    if (this.isEditable) return
    const img = this.$refs.img
    new MutationObserver(changes => {
      const change = changes[0]
      if (change.attributeName.includes('src')) {
        this.isImageHide = true
      }
    }).observe(img, { attributes: true })
  },
  computed: {
    ...mapGetters({ user: 'user/getUser' }),
  }
}
</script>
<style lang="scss">
  .card {
    display: flex;
    flex-direction: column;
    background: $secondary;
    margin-top: $offset;
    padding: $offset;
    border-radius: $border-radius-m;
    width: calc(25% - #{$offset});
    margin-left: $offset;
    font-size: 14px;
    @media screen and (max-width: $screen-m) {
      width: calc(50% - #{$offset});
    }
    @media screen and (max-width: $screen-s) {
      width: 100%;
    }
    &__header {
      display: flex;
      justify-content: space-between;
    }
    &__image {
      height: 120px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      & > img {
        object-fit: cover;
      }
      & > img.portrait {
        width: 100%;
        height: auto;
      }
      & > img.landscape {
        width: auto;
        height: 100%;
      }
      & > img.hide {
        opacity: 0;
      }
    }
    &__body {
      font-weight: $font-weight-sb;
      margin-top: 4px;
      display: flex;
      align-items: center;
      @media screen and (max-width: $screen-m) {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    &__controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: $font-size-s;
      margin-top: 6px;
    }
    &__name {
      display: block;
      font-weight: $font-weight-sb;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 6px;
      font-size: $font-size-sm;
      @media screen and (max-width: $screen-s) {
        font-size: 14px;
        font-weight: $font-weight-b;
      }
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>

