<template>
  <div class="file-input">
    <input
      type="file"
      accept=".jpg, .jpeg, .png, .webp, .jfif"
      @change="onFileInputChange"
      ref="fileInput"
      :multiple="multiple"
    >
    <button :class="{[buttonClass]: true}" @click="triggerFileInput">{{buttonText}}</button>
  </div>
</template>

<script>
export default {
  props: {
    multiple: Boolean,
    buttonClass: String,
    buttonText: String
  },
  emits: ['change'],
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    onFileInputChange(e) {
      this.$emit('change', e.target.files)
      this.$refs.fileInput.value = ''
    }
  }
}
</script>
