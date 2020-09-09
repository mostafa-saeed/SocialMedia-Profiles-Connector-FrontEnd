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
  components: {
    Scanner,
  },

  data: () => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
  }),
};
</script>
