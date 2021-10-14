<template>
  <div class="auth">
    <BaseTabs>
      <BaseTabsItem name="Войти" :selected="true">
        <AuthLogin/>
      </BaseTabsItem>
      <BaseTabsItem name="Регистрация">
        <AuthRegister/>
      </BaseTabsItem>
    </BaseTabs>
  </div>
</template>
<script>
export default {
  middleware: ['login'],
  head() {
    return {
      title: 'Вход',
    }
  },
}
</script>

<style lang="scss">
  .auth {
    max-width: 400px;
    @include border-s($secondary);
    border-radius: $border-radius-s;
    margin: 30vh auto 0 auto;
    @media (max-width: $screen-s) {
      margin: 30vh $offset 0 $offset;
    }
  }
</style>
