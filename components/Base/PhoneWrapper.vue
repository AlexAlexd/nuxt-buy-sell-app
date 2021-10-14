<template>
  <div class="phone-wrapper">
    <div v-if="isShow">{{phone}}</div>
    <button class="btn-primary" v-else @click="showNumber">Показать телефон</button>
  </div>
</template>

<script>
export default {
  props: {
    phone: [String, Number]
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    showNumber() {
      this.isShow = true
    }
  }
}
</script>