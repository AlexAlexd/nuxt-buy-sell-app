<template>
  <div class="chat">
    <div class="chat__header" @click="toggleChat">
      <div class="chat__info">
        <div class="chat__name">{{ sender }}</div>
        <div class="chat__new" v-if="newMessages !== 0">{{newMessages}}</div>
      </div>
    </div>
    <div class="chat__body" v-if="isOpen">
      <div class="chat__messages">
        <div
          v-for="(message, i) in messages"
          :key="i"
          class="message"
          :class="{ [messageClass(message)]: true }"
        >
          <div class="message__content">
            <div class="message__file" v-if="message.url">
              <img :src="message.url" alt="Image">
            </div>
            <span class="message__text" v-if="message.text">{{ message.text }}</span>
            <span class="message__time">{{ message.time }}</span>
          </div>
        </div>
        <div class="chat__plug" ref="plug"></div>
      </div>
      <div class="chat__messagebox">
        <div class="chat__files" v-if="files.length">
          <span class="chat__count-files">Файлы: {{files.length}}</span>
          <span class="chat__clear-files" @click="files = []">&times;</span>
        </div>
        <div class="chat__form">
          <BaseFileInput
            @change="onFileInputChange"
            :multiple="true"
            :buttonClass="'chat__button'"
            :buttonText="'📎'"
          />
          <input
            class="chat__textbox"
            type="text"
            placeholder="Введите сообщение"
            v-model="text"
            @keydown.enter="onMessageSubmit"
          >
          <button class="chat__button" @click="onMessageSubmit">⏎</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    chat: Object,
  },
  data() {
    return {
      isOpen: false,
      sender: null,
      messages: [],
      text: '',
      newMessages: 0,
      allMessages: 0,
      files: [],
    }
  },
  async created() {
    const chatRef = this.$fire.database.ref(`chats/${this.chat.chatKey}`)
    const messagesRef = chatRef.child('messages')
    await this.fetchSenderName(chatRef)
    this.listenForMessages(messagesRef)
  },
  methods: {
    onFileInputChange(files) {
      this.files = [...files]
    },
    async toggleChat() {
      if (this.isOpen) {
        this.isOpen = false
      } else {
        this.isOpen = true
        this.newMessages = 0
        const res = this.$fire.database.ref(`chats/${this.chat.chatKey}/users/${this.user.uid}/newMessages`)
        await res.set(this.allMessages)
      }
    },
    async listenForMessages(messagesRef) {
      messagesRef.on('child_added', async snap => {
        const message = snap.val()
        this.messages.push(message)

        this.allMessages++

        if (!this.isOpen) {
          const res = await this.$fire.database.ref(`chats/${this.chat.chatKey}/users/${this.user.uid}/newMessages`).get()
          const readedMessages = +res.val()
          this.newMessages = this.allMessages - readedMessages
        } else {
          const res = this.$fire.database.ref(`chats/${this.chat.chatKey}/users/${this.user.uid}/newMessages`)
          await res.set(this.allMessages)
        }
        this.scrollToMessage(this.isOpen)
      })
    },
    async fetchSenderName(chatRef) {
      const usersRes = await chatRef.child('users').get()
      const chatUsers = Object.values(usersRes.val())
      this.sender = chatUsers.filter(user => user.name !== this.user.name)[0].name || this.user.name
    },
    async onMessageSubmit() {
      if (this.files.length) {
        for await (const file of this.files) {
          const fileName = Date.now().toString()
          const ref = this.$fire.storage.ref(`images/chats/${this.chat.chatKey}/${fileName}`)
          await ref.put(file)
          const fileUrl = await ref.getDownloadURL()
          this.files = []
          await this.sendMessage(this.$fire, null, this.user.uid, this.chat.chatKey, fileUrl)
        }
      }
      if (this.text.trim()) {
        await this.sendMessage(this.$fire, this.text, this.user.uid, this.chat.chatKey)
        this.text = ''
      }
    },
    scrollToMessage(value) {
      if (!value) return
      this.$nextTick(() => {
        const scrollEl = this.$refs.plug
        if (scrollEl) {
          scrollEl.scrollIntoView()
        }
      })
    }
  },
  watch: {
    isOpen(value) {
      this.scrollToMessage(value)
    }
  },
  computed: {
    messageClass() {
      return message => message.uid === this.user.uid ? 'self' : 'friend'
    },
    ...mapGetters({ user: 'user/getUser' }),
  }
}
</script>
<style lang="scss">
  .chat {
    @include border-s($secondary);
    border-radius: $border-radius-s;
    margin-top: $offset;
    &__header {
      padding: $offset;
      cursor: pointer;
    }
    &__info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__name {
      font-weight: $font-weight-b;
    }
    &__new {
      font-size: $font-size-s;
      color: white;
      line-height: 20px;
      width: 20px;
      text-align: center;
      background: $primary;
      border-radius: 50%;
    }
    &__messages {
      height: 300px;
      background: aliceblue;
      overflow-y: auto;
    }
    &__form {
      display: flex;
      align-items: center;
    }
    &__files {
      display: flex;
      align-items: center;
      padding: 5px;
      border-bottom: 1px solid $secondary;
    }
    &__count-files {
      font-size: $font-size-s;
    }
    &__clear-files {
      width: 20px;
      height: 20px;
      line-height: 17px;
      text-align: center;
      margin-left: $offset;
      cursor: pointer;
      font-size: $font-size-m;
    }
    &__button {
      min-width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: $font-size-m;
      cursor: pointer;
    }
    &__textbox {
      height: 40px;
      width: 100%;
      font-size: $font-size-sm;
      padding: 0 $offset-sm;
    }
    &__plug {
      margin-top: $offset;
    }
  }
  .message {
    margin-top: $offset;
    display: flex;
    &:last-child {
      margin-bottom: $offset;
    }
    &__content {
      line-height: 20px;
      background: white;
      padding: 6px;
      border-radius: $border-radius-s;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    &__text {
      max-width: 300px;
      line-break: anywhere;
    }
    &__time {
      font-size: $font-size-s;
      line-height: 1;
      color: gray;
      margin-left: 4px;
    }
    &__file {
      height: 180px;
      max-width: 200px;
      border-radius: $border-radius-s;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      & > img {
        height: 100%;
        width: auto;
      }
    }
    &.self {
      justify-content: flex-end;
      margin-right: $offset;
      & > span {
        color: $primary;
      }
    }
    &.friend {
      justify-content: flex-start;
      margin-left: $offset;
      & > span {
        color: black;
      }
    }
  }
</style>

