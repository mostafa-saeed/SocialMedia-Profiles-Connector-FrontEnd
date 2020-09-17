<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>

        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="token" link to="/profile" exact>
          <v-list-item-action>
            <v-icon>mdi-email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="token" @click="logout">
          <v-list-item-action>
            <v-icon>mdi-email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!token" link to="/login" exact>
          <v-list-item-action>
            <v-icon>mdi-email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!token" link to="/register" exact>
          <v-list-item-action>
            <v-icon>mdi-email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Register</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>

    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col class="text-center">
            <router-view :token="token" :user="user" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

  </v-app>

</template>

<style>
html {
  overflow: auto !important;
}
</style>

<script>
import {
  getToken, getUser, removeAuthentication, setAuthentication,
} from './services/auth';

export default {
  name: 'App',

  data: () => ({
    drawer: false,
    token: getToken(),
    user: getUser(),
  }),

  methods: {
    logout() {
      this.token = null;
      this.user = null;
      removeAuthentication();

      this.$router.push({ name: 'Login' });
    },
    login(token, user) {
      this.token = token;
      this.user = user;
      setAuthentication(token, user);

      this.$router.push({ name: 'Home' });
    },
  },

  created() {
    this.$root.login = this.login;
  },

};
</script>
