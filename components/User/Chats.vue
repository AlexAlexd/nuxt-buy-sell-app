<template>
  <div class="messages">
    <h3 v-if="showPlug" class="no-items-plug">Нет сообщений</h3>

    <UserChat v-for="(key, i) in keys" :key="i" :chat="key"/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      keys: [],
      showPlug: false
    }
  },
  mounted() {
    this.fetchChatKeys()
  },
  methods: {
    fetchChatKeys() {
      const userChatRef = this.$fire.database.ref(`users/${this.user.uid}/chats`)

      this.showPlug = true
      userChatRef.on('child_added', snap => {
        const chatKey = snap.val()

        this.showPlug = false
        this.keys.push(chatKey)
      })

    }
  },
  computed: {
    ...mapGetters({ user: 'user/getUser' }),
  },
  watch: {
    user(val) {
      if (!val) return
      this.keys = []
      this.fetchChatKeys()
    }
  }
}
</script>