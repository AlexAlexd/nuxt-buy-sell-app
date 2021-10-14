<template>
  <div class="tabs">
    <div class="tabs__header">
      <a
        class="tabs__link"
        v-for="(tab, i) in tabs"
        :key="i"
        @click="selectTab(tab, i)"
        :class="{active: (i === selectedIndex)}"
      >{{tab.name}}</a>
    </div>
    <div class="tabs__content">
      <slot/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedIndex: 0,
      tabs: []
    }
  },
  mounted() {
    this.tabs = this.$children
    this.tabs.forEach((tab, index) => {
      if (tab.isActive) {
        this.selectedIndex = index
      }
    })
  },
  methods: {
    selectTab(selectedTab, i) {
      this.selectedIndex = i
      this.tabs.forEach(tab => {
        tab.isActive = (tab.name === selectedTab.name)
      })
    }
  }
}
</script>
<style lang="scss">
  .tabs {
    width: 100%;
    background: white;
    &__header {
      display: flex;
    }
    &__link {
      width: 50%;
      line-height: 30px;
      text-align: center;
      border-bottom: 2px solid transparent;
      &:hover {
        cursor: pointer;
      }
      &.active {
        color: $primary;
        border-bottom: 2px solid $primary;
      }
    }
  }
</style>
