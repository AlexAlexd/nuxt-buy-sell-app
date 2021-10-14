<template>
  <form class="form" @submit.prevent="register">
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
    <input class="btn-action" :class="{disabled: loading}" type="submit" value="Регистрация">
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
    async register() {
      const isFormValid = await this.$validate()
      if (!isFormValid) return
      if (this.loading) return
      this.loading = true
      let data = null
      try {
        data = await this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password)
      } catch (e) {
        if (e.code.includes('auth/email-already-in-use')) {
          this.error = 'Уже существует пользователь с данным Email'
        }
        this.loading = false
      }
      if (!data) return
      const { uid } = data.user
      this.$cookies.set('uid', uid)

      const userRef = this.$fire.database.ref(`users/${uid}`)
      const user = {
        imageURL: '',
        name: 'Аноним',
        phoneNumber: 'Нет телефона',
        uid
      }
      await userRef.set(user)
      this.setUser(user)
      this.loading = false
      this.$router.push('/profile')
    },
    ...mapMutations({ setUser: 'user/SET_USER' })
  }
}
</script>

