<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link v-if="token" to="/profile">Profile</router-link> |
      <a href="#" v-if="token" @click="logout">Logout</a>
      <router-link v-if="!token" to="/login">Login</router-link> |
      <router-link v-if="!token" to="/register">Register</router-link>
    </div>
    <router-view :token="token" :user="user" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import {
  getToken, getUser, removeAuthentication, setAuthentication,
} from './services/auth';

export default {
  data: () => ({
    token: getToken(),
    user: getUser(),
  }),

  methods: {
    logout() {
      this.token = null;
      this.user = null;
      removeAuthentication();
      this.$router.push({ name: 'Home' });
    },

    login(token, user) {
      this.token = token;
      this.user = user;
      setAuthentication(token, user);
    },
  },
};
</script>
