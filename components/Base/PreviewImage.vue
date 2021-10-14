<template>
  <div class="preview-photo">
    <img :src="createImageSrc(source)">
    <button class="preview-photo__delete" @click="onDelete">&times;</button>
  </div>
</template>

<script>
export default {
  props: ['source', 'index'],
  methods: {
    createImageSrc(source) {
      return (source instanceof Blob) ? URL.createObjectURL(source) : source.url
    },
    onDelete() {
      this.$emit('delete', this.index)
    }
  }
}
</script>

<style lang="scss">
  .preview-photo {
    position: relative;
    height: 100px;
    width: 100px;
    background-color: #f7f7f7;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-right: $offset;
    margin-top: $offset;
    border-radius: $border-radius-m;
    &:nth-child(4n) {
      margin-right: 0;
    }
    &:hover > &__delete {
      display: block;
    }
    &__delete {
      position: absolute;
      height: 30px;
      width: 30px;
      border-radius: $border-radius-s;
      background: white;
      top: 4px;
      right: 4px;
      font-size: $font-size-m;
      line-height: 30px;
      text-align: center;
      display: none;
      @media (max-width: $screen-l) {
        display: block;
      }
      &:hover {
        cursor: pointer;
      }
    }
    & > img {
      height: auto;
      width: 100%;
    }
  }
</style>
