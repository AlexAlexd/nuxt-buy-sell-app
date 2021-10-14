<template>
  <div class="user">
    <div class="user__header" v-if="isEditing">
      <div class="container">
        <div class="user__image">
          <img :src="imageURL" alt="profile image" v-if="imageURL">
        </div>
        <BaseFileInput
          @change="onFileInputChange"
          :multiple="false"
          :buttonClass="'btn-primary user-property'"
          buttonText="Выбрать фото"
        />
        <input class="user-property input-field" type="text" v-model="name" placeholder="name">
        <input
          class="user-property input-field"
          type="text"
          v-mask="'+38(###)-###-##-##'"
          v-model="phoneNumber"
          placeholder="phone"
        >
        <button class="btn-primary color-red" @click="cancelEdit">Отмена</button>
        <button class="btn-primary" @click="saveEdit">Сохранить</button>
      </div>
    </div>
    <div class="user__header" v-else>
      <div class="container">
        <div class="user__image">
          <img :src="imageURL" alt="profile image" v-if="imageURL">
        </div>
        <span class="user__name user-property">{{ name }}</span>
        <span class="user__phone user-property">{{ phoneNumber ? phoneNumber : 'Нет телефона' }}</span>
        <nuxt-link class="user-property btn-action" to="/create">Создать обьявление</nuxt-link>
        <button class="btn-primary" @click="isEditing = true">Редактировать профиль</button>
        <button class="btn-primary color-red" @click="logOut">Выйти</button>
      </div>
    </div>
    <div class="user__footer container-sm">
      <BaseTabs>
        <BaseTabsItem name="Мои обьявления" :selected="true">
          <UserPosts/>
        </BaseTabsItem>
        <BaseTabsItem name="Сообщения">
          <UserChats/>
        </BaseTabsItem>
      </BaseTabs>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  head() {
    return {
      title: 'Мой профиль',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.name}, Номер телефона: ${this.phoneNumber}`
        }
      ]
    }
  },
  middleware: ['profile'],
  data() {
    return {
      name: '',
      phoneNumber: '',
      imageURL: '',
      imageFile: null,
      isEditing: false
    }
  },
  methods: {
    async saveEdit() {
      function createUserRef(path, ctx) {
        return ctx.$fire.database.ref(`users/${ctx.user.uid}/${path}`)
      }

      let newImageURL = this.user.imageURL || null

      if (this.imageFile) {
        const ref = this.$fire.storage.ref(`/images/users/${this.user.uid}/profile-photo`)
        await ref.put(this.imageFile)
        newImageURL = await ref.getDownloadURL()
        const imageURLRef = createUserRef('imageURL', this)
        await imageURLRef.set(newImageURL)
      }

      this.name = this.name.slice(0, 20)

      if (this.phoneNumber.length < 18) {
        this.phoneNumber = ''
      }

      if (this.name !== this.user.name) {
        const nameRef = createUserRef('name', this)
        await nameRef.set(this.name)
      }
      if (this.phoneNumber !== this.user.phoneNumber) {
        const phoneNumberRef = createUserRef('phoneNumber', this)
        await phoneNumberRef.set(this.phoneNumber)
      }

      this.setUser({
        name: this.name,
        phoneNumber: this.phoneNumber,
        imageURL: newImageURL,
        uid: this.user.uid
      })

      this.isEditing = false
    },
    cancelEdit() {
      this.setupFields()
      this.isEditing = false
    },
    onFileInputChange(files) {
      this.imageFile = files[0]
      this.imageURL = URL.createObjectURL(this.imageFile)
    },
    setupFields() {
      if (!this.user) return
      this.imageURL = this.user.imageURL
      this.name = this.user.name
      this.phoneNumber = this.user.phoneNumber
    },
    async logOut() {
      const confirmLogout = confirm('Вы уверены что хотите выйти?')
      if (!confirmLogout) return
      try {
        await this.$fire.auth.signOut()
        this.setUser(null)
        this.$router.push('/auth')
        this.$cookies.removeAll()
        console.log(this.getUser);

      } catch (e) {
        console.log(e)
      }
    },
    ...mapMutations({ setUser: 'user/SET_USER' })
  },
  async mounted() {
    this.setupFields()
  },
  watch: {
    user() {
      this.setupFields()
    }
  },
  computed: {
    ...mapGetters({ user: 'user/getUser' }),
  }
}
</script>
<style lang="scss">
  .user {
    &__header {
      & > .container {
        display: flex;
        align-items: center;
        padding: $offset;
        @media screen and (max-width: $screen-m) {
          flex-direction: column;
        }
      }
      border-bottom: 1px solid $secondary;
    }
    &-property {
      margin-left: $offset;
      @media screen and (max-width: $screen-m) {
        margin: {
          left: 0;
          top: 5px;
        }
      }
    }
    &__name {
      font-size: $font-size-m;
      font-weight: $font-weight-sb;
    }
    &__image {
      min-height: 60px;
      min-width: 60px;
      width: 60px;
      height: 60px;
      overflow: hidden;
      border-radius: 50%;
      background-color: #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      & > img {
        height: 100%;
        width: auto;
      }
    }
    &__footer {
      margin-top: $offset;
    }
  }
</style>
