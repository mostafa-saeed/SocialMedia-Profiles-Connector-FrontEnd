<template>
  <v-app>

    <SideBar :drawer.sync="drawer" :token="token" />

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>SocialMedia Profiles Connector</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon large @click="toggleDarkMode">
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>

      <v-snackbar color="error" timeout="-1" v-model="showMessage">
        {{ message }}

        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="showMessage=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>

      </v-snackbar>
      <v-container class="fill-height" fluid>
        <router-view :token="token" :user="user" />
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
import SideBar from './components/SideBar.vue';
import {
  getToken, getUser, removeAuthentication, setAuthentication,
} from './services/auth';

const darkMode = localStorage.getItem('darkMode');

export default {
  name: 'App',

  data: () => ({
    drawer: false,
    showMessage: false,
    message: '',
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

    showErrorMessage(message) {
      this.message = message;
      this.showMessage = true;
    },

    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem('darkMode', this.$vuetify.theme.dark || '');
    },
  },

  created() {
    this.$root.login = this.login;
    this.$root.logout = this.logout;
    this.$root.showErrorMessage = this.showErrorMessage;
    this.$vuetify.theme.dark = darkMode;
    console.log('testing', this.$router);
  },

  components: {
    SideBar,
  },

};
</script>
