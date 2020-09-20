<template>
  <div v-if="userProfile">
    <h2>{{ userProfile.username }} profile</h2>
  </div>
</template>

<script>
import sendRequest from '@/services/api';

export default {
  name: 'Profile',
  data: () => ({
    userProfile: false,
  }),

  props: {
    user: Object,
  },

  async created() {
    try {
      const { username } = this.$route.params.username ? this.$route.params : this.user;
      this.userProfile = await sendRequest('GET', `users/${username}`);
    } catch (error) {
      if (error.name === 'API_ERROR') {
        this.$root.showErrorMessage(error.message);
      } else {
        this.$root.showErrorMessage('Something went wrong');
      }
      this.$router.push({ name: 'Home' });
    }
  },
};
</script>
