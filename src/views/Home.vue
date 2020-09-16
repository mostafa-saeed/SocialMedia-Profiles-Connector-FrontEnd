<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <p v-if="user">Hello {{ user.username }}</p>
    <scanner />
  </div>
</template>

<script>
import Scanner from '@/components/Scanner.vue';

export default {
  name: 'Home',
  props: {
    token: String,
    user: Object,
  },
  components: {
    Scanner,
  },
};
</script>
