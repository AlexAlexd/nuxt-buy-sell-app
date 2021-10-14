<template>
  <div class="create">
    <div class="container-sm">
      <button class="btn-primary back-btn" @click="$router.go(-1)">Назад</button>
      <div class="create__form">
        <h3 class="create__hint">{{$route.query.edit ? 'Редактировать' : 'Создать'}} обьявление</h3>
        <BaseFileInput
          @change="onFileInputChange"
          :multiple="true"
          :buttonClass="'btn-primary'"
          :buttonText="'Выберите фото'"
        />
        <div class="error-message">{{validation.firstError('files')}}</div>
        <div class="create__photos">
          <BasePreviewImage
            v-for="(source, i) in files"
            :key="i"
            :source="source"
            :index="i"
            @delete="deleteImage"
          />
        </div>
        <div class="create__fields">
          <BaseInputField
            v-model="title"
            type="text"
            placeholder="Название"
            :error="validation.hasError('title')"
            :errorMessage="validation.firstError('title')"
          />
          <BaseInputField
            v-model="price"
            type="number"
            placeholder="Цена"
            :error="validation.hasError('price')"
            :errorMessage="validation.firstError('price')"
          />
          <BaseInputField
            :tag="'textarea'"
            v-model="description"
            placeholder="Описание"
            :error="validation.hasError('description')"
            :errorMessage="validation.firstError('description')"
          />
          <BaseInputField
            v-model="city"
            type="text"
            placeholder="Город"
            :error="validation.hasError('city')"
            :errorMessage="validation.firstError('city')"
          />
          <button
            class="create__submit btn-action"
            @click="$route.query.edit ? saveChanges() : createPost()"
            :class="{disabled: isDisabled}"
          >{{$route.query.edit ? 'Сохранить изменения' : 'Создать обьявление'}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Validator } from 'simple-vue-validator'

const MAX_TITLE_LENGTH = 120
const MAX_DESCRIPTION_LENGTH = 350
const MIN_TITLE_LENGTH = 5
const MIN_DESCRIPTION_LENGTH = 5

export default {
  middleware: ['editPost', 'profile'],
  layout: 'simple',
  head() {
    return {
      title: `${this.$route.query.edit ? 'Редактировать обьявление' : 'Создать обьявление'}`,
    }
  },
  data() {
    return {
      files: [],
      title: '',
      price: '',
      city: '',
      description: '',
      imagesToDelete: [],
      isDisabled: false,
      requiredFieldText: 'Поле необходимо заполнить',
      errorsText: {
        city: 'Город должен содержать только буквы',
        title: {
          min: `Описание должно содержать минимум ${MIN_TITLE_LENGTH} символов`,
          max: `Описание должно содержать максимум ${MAX_TITLE_LENGTH} символов`
        },
        desription: {
          min: `Описание должно содержать минимум ${MIN_DESCRIPTION_LENGTH} символов`,
          max: `Описание должно содержать максимум ${MAX_DESCRIPTION_LENGTH} символов`
        },
        files: 'Обьявление должно содержать минимум 1 фото'
      },
      beforeReloadText: 'Несохранённые данные, продолжить?'
    }
  },
  validators: {
    files: function (value) {
      return Validator.custom(function () {
        return value.length >= 1
      })
    },
    files: function (value) {
      return Validator.value(value).required(this.errorsText.files)
    },
    title: function (value) {
      return Validator
        .value(value)
        .required(this.requiredFieldText)
        .minLength(MIN_TITLE_LENGTH, this.errorsText.title.min)
        .maxLength(MAX_TITLE_LENGTH, this.errorsText.title.max)
    },
    description: function (value) {
      return Validator
        .value(value)
        .required(this.requiredFieldText)
        .minLength(MIN_DESCRIPTION_LENGTH, this.errorsText.desription.min)
        .maxLength(MAX_DESCRIPTION_LENGTH, this.errorsText.desription.max)
    },
    price: function (value) {
      return Validator.value(value).required(this.requiredFieldText)
    },
    city: function (value) {
      return Validator.value(value).required(this.requiredFieldText).regex('[а-яА-Я ]+', this.errorsText.city);
    },
  },
  async mounted() {
    if (this.$route.query.edit) {
      this.setupFields()
    }
    window.onbeforeunload = function (e) {

    };
    window.addEventListener('beforeunload', this.onReload.bind(this))
  },
  unmounted() {
    window.removeEventListener('beforeunload', this.onReload.bind(this))
  },
  methods: {
    onReload(e) {
      const self = this
      if (self.$route.name === 'create') {
        e = e || window.event
        if (e) {
          e.returnValue = this.beforeReloadText
        }
        return this.beforeReloadText
      } else {
        return null
      }
    },
    async createPost() {
      const isFormValid = await this.$validate()
      if (!isFormValid) return
      const postData = {
        files: this.files,
        info: {
          title: this.title,
          price: this.formatPrice(this.price),
          city: this.city,
          description: this.description
        },
        author: {
          name: this.user.name,
          uid: this.user.uid,
          city: this.city,
          phoneNumber: this.user.phoneNumber,
          imageURL: this.user.imageURL || ''
        }
      }
      const { files, info, author } = postData

      const postRef = this.$fire.database.ref(`posts`).push()
      const postKey = postRef.key
      this.isDisabled = true
      await postRef.set({
        id: Date.now().toString(),
        info: {
          ...info,
          id: postKey
        },
        author
      })

      await this.uploadImages(postKey)
      await this.setKeyWords(postRef, info.title)

      const userPostsRef = this.$fire.database.ref(`users/${this.user.uid}/posts`)
      await userPostsRef.update({ [postKey]: 1 })
      this.isDisabled = false
      this.$router.push('/')
    },
    async saveChanges() {
      const isFormValid = await this.$validate()
      if (!isFormValid) return
      const post = this.$route.params.post
      const postKey = post.info.id
      this.isDisabled = true

      this.imagesToDelete.forEach(async (item) => {
        const imageRef = this.$fire.storage.ref(`images/posts/${postKey}/${item.name}`)
        await imageRef.delete()
        const databaseRef = this.$fire.database.ref(`posts/${postKey}/images/${item.name}`)
        await databaseRef.set(null)
      })

      await this.uploadImages(postKey)

      const postRef = this.$fire.database.ref(`posts/${postKey}`)

      const info = {
        title: this.title,
        price: this.formatPrice(this.price),
        city: this.city,
        description: this.description
      }

      const postRefInfo = postRef.child('info')
      await postRefInfo.update(info)

      await this.setKeyWords(postRef, info.title)
      this.isDisabled = false
      alert('Изменения сохранены!')
      this.$router.push('/')
    },
    async uploadImages(postKey) {
      for await (const file of this.files) {
        if (file instanceof Blob) {
          const databaseRef = this.$fire.database.ref(`posts/${postKey}/images`).push()
          const name = databaseRef.key

          const storageRef = this.$fire.storage.ref(`images/posts/${postKey}/${name}`)
          await storageRef.put(file)
          const url = await storageRef.getDownloadURL()

          await databaseRef.set({ name, url })
        }
      }
    },
    deleteImage(index) {
      const item = this.files[index]
      if (!(item instanceof Blob)) {
        this.imagesToDelete.push(item)
      }
      this.files.splice(index, 1)
    },
    setupFields() {
      const post = this.$route.params.post
      this.files = Object.values(post.images)
      for (const key in post.info) {
        if (key === 'id') continue
        if (key === 'price') {
          post.info[key] = post.info[key].replace('₴', '').replace(/\s/g, '')
        }
        this[key] = post.info[key]
      }
    },
    formatPrice(str) {
      const price = str.split('')
      price.splice(price.length - 3, 0, ' ')
      return price.join('') + '₴'
    },
    async setKeyWords(ref, title) {
      const keyWords = title.trim().split(' ')
      let index = 0
      for await (const keyWord of keyWords) {
        const key = { [`key-${index}`]: keyWord.toLowerCase() }
        await ref.update(key)
        index++
      }
    },
    onFileInputChange(files) {
      if (this.files.length === 8) return
      if (files) {
        this.files = [...this.files, ...files]
      }
    }
  },
  computed: {
    ...mapGetters({ user: 'user/getUser' })
  },
}
</script>
<style lang="scss">
  .create {
    &__hint {
      margin: {
        top: $offset;
        bottom: $offset;
      }
    }
    &__photos {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      max-width: 500px;
    }
    &__fields {
      display: flex;
      flex-direction: column;
      max-width: 300px;
      padding-bottom: $offset;
      & > input {
        margin-top: $offset;
      }
    }
    &__submit {
      margin-top: $offset;
      width: 100%;
      &.disabled {
        opacity: 0.5;
      }
    }
  }
</style>
