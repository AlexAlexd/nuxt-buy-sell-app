<template>
  <form class="form" @submit.prevent="login">
    <div class="form__error">{{error}}</div>
    <BaseInputField
      v-model="email"
      type="text"
      placeholder="Email"
      :error="validation.hasError('email')"
      errorMessage="Введите пожалуйста коррестный Email"
    />
    <BaseInputField
      v-model="password"
      type="password"
      placeholder="Пароль"
      :error="validation.hasError('password')"
      errorMessage="Пароль должен иметь длину минимум 6 символов"
    />
    <input class="btn-action" :class="{disabled: loading}" type="submit" value="Войти">
  </form>
</template>
<script>
import { mapMutations } from 'vuex'
import { Validator } from 'simple-vue-validator'

export default {
  middleware: 'login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    }
  },
  validators: {
    email: function (value) {
      return Validator.value(value).required().email()
    },
    password: function (value) {
      return Validator.value(value).required().minLength(6)
    }
  },
  methods: {
    async login() {
      const isFormValid = await this.$validate()
      if (!isFormValid) return
      if (this.loading) return
      this.loading = true
      let data = null
      try {
        data = await this.$fire.auth.signInWithEmailAndPassword(this.email, this.password)
      } catch (e) {
        const code = e.code
        if (code.includes('wrong-password')) {
          this.error = 'Неправельный пароль'
        } else if (code.includes('user-not-found')) {
          this.error = 'Пользователь с данным Email не найден'
        }
        this.loading = false
      }
      if (!data) {
		  console.log('no such user');
		  return
	  }
      const { uid } = data.user
      this.$cookies.set('uid', uid)

      const user = await this.$fire.database.ref(`users/${uid}`).get()
      if (!user) return

      console.log(user.val());

      this.setUser(user.val())
      this.loading = false
      this.$router.push('/profile')
    },
    ...mapMutations({ setUser: 'user/SET_USER' })
  }
}
</script>

