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

  beforeCreate() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  methods: {
    async submit(e) {
      e.preventDefault();
      try {
        const { login, password } = this;
        const { token, user } = await sendRequest('POST', 'users/login', {
          login, password,
        });

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        this.$router.push({ name: 'Home' });
      } catch (error) {
        alert(error);
      }
    },
  },
};
</script>
