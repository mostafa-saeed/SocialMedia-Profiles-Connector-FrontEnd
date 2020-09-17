<template>
  <div>
    <form>
      <input type="text" v-model="login" placeholder="username or email">
      <input type="password" v-model="password" autocomplete="password" placeholder="password">
      <button @click="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import sendRequest from '@/services/api';

export default {
  name: 'Register',
  data: () => ({
    login: '',
    password: '',
  }),

  methods: {
    async submit(e) {
      e.preventDefault();
      try {
        const { login, password } = this;
        const { token, user } = await sendRequest('POST', 'users/login', {
          login, password,
        });

        this.$root.login(token, user);
      } catch (error) {
        alert(error);
      }
    },
  },
};
</script>
