<template>
  <div class="messagebox" v-if="isDisplay">
    <textarea
      class="messagebox__field textarea"
      placeholder="Введите ваше сообщение"
      v-model="text"
    ></textarea>
    <button
      class="messagebox__submit btn-action"
      @click="onMessageSubmit"
      :class="{disabled: !text.trim()}"
    >Отправить</button>
  </div>
  <div
    v-else
  >Сообщение успешно отправлено! Продолжите беседу в своём профиле, во вкладке "Сообщения"</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    author: Object
  },
  data() {
    return {
      text: '',
      isDisplay: false
    }
  },
  methods: {
    async onMessageSubmit() {
      if (!this.text.trim()) return
      await this.createChat()
    },
    async createChat() {
      const chatRef = this.$fire.database.ref('chats').push()
      const chatKey = chatRef.key

      const users = {
        [this.author.uid]: { name: this.author.name, newMessages: 0, },
        [this.user.uid]: { name: this.user.name, newMessages: 1, }
      }

      await chatRef.set({ users })
      const createChatRef = uid => this.$fire.database.ref(`users/${uid}/chats`).push()

      await createChatRef(this.author.uid).set({ chatKey })
      await createChatRef(this.user.uid).set({ chatKey })

      const visitedRef = this.$fire.database.ref(`users/${this.user.uid}/visited`).push()
      await visitedRef.set(this.author.uid)

      await this.sendMessage(this.$fire, this.text, this.user.uid, chatKey)

      this.isDisplay = false
    },
    async checkIfChatExist() {
      const res = await this.$fire.database.ref(`users/${this.user.uid}/visited`).get()
      const visitedUids = res.val()
      if (!visitedUids) {
        this.isDisplay = true
      } else {
        const isChatExist = !!Object.values(visitedUids).find(uid => uid === this.author.uid)
        this.isDisplay = !isChatExist
      }
    }
  },
  mounted() {
    this.checkIfChatExist()
  },
  computed: {
    ...mapGetters({ user: 'user/getUser' }),
  }
}
</script>

<style lang="scss">
  .messagebox {
    margin-top: $offset;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    &__field {
      width: 400px;
    }
    &__submit {
      margin-top: $offset;
    }
  }
</style>

