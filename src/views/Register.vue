<template>
  <div>
    <form>
      <input type="text" v-model="username" placeholder="username">
      <input type="email" v-model="email" placeholder="email">
      <input type="password" v-model="password" autocomplete="password" placeholder="password">
      <input type="password" v-model="repassword" autocomplete="password" placeholder="repassword">
      <button @click="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import sendRequest from '@/services/api';

export default {
  name: 'Register',
  data: () => ({
    username: '',
    email: '',
    password: '',
    repassword: '',
  }),

  beforeCreate() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  methods: {
    async submit(e) {
      e.preventDefault();
      try {
        const { username, email, password } = this;
        const { token, user } = await sendRequest('POST', 'users', {
          username, email, password,
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
