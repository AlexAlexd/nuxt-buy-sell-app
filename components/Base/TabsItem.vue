<template>
  <div v-show="isActive">
    <slot/>
  </div>
</template>
<script>
export default {
  props: {
    index: Number,
    name: String,
    selected: Boolean
  },
  data() {
    return {
      isActive: false
    }
  },
  mounted() {
    this.isActive = this.selected
  }
}
</script>

