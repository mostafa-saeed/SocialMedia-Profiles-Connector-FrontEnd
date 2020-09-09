<template>
  <div v-if="user">
    <h2>{{ user.username }} profile</h2>
  </div>
</template>

<script>
import sendRequest from '@/services/api';

export default {
  name: 'Profile',
  data: () => ({
    user: false,
  }),

  async beforeCreate() {
    try {
      const { username } = this.$route.params;
      this.user = await sendRequest('GET', `users/${username}`);
    } catch (error) {
      alert(error);
      this.$router.push({ name: 'Home' });
    }
  },
};
</script>
