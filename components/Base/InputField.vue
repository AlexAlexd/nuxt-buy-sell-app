<template>
  <div class="field">
    <input
      v-if="!tag"
      class="field__input input-field"
      :class="{error}"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
    <textarea
      class="field__input textarea"
      :class="{error}"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
      v-else
    ></textarea>
    <div v-if="error" class="error-message">{{ errorMessage }}</div>
  </div>
</template>
<script>
export default {
  props: {
    tag: String,
    value: String,
    type: String,
    placeholder: String,
    error: Boolean,
    errorMessage: String,
    dirty: Boolean
  }
}
</script>
<style lang="scss">
  .field {
    margin-top: $offset;
    width: 100%;
    &__input {
      width: 100%;
      @include border-s(transparent);
      &.error {
        @include border-s(red);
      }
    }
  }
</style>
