<template>
  <div class="page-container">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">SocialMedia Profile Connector</span>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">Menu</md-toolbar>

        <md-list>
          <router-link to="/" exact>
            <md-list-item>
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Home</span>
            </md-list-item>
          </router-link>

          <router-link v-if="token" to="/profile" exact>
            <md-list-item>
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Profile</span>
            </md-list-item>
          </router-link>

          <a v-if="token" @click="logout">
            <md-list-item>
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Logout</span>
            </md-list-item>
          </a>

          <router-link v-if="!token" to="/login" exact>
            <md-list-item>
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Login</span>
            </md-list-item>
          </router-link>

          <router-link v-if="!token" to="/register" exact>
            <md-list-item>
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Register</span>
            </md-list-item>
          </router-link>

        </md-list>
      </md-app-drawer>

      <md-app-content>
        <!-- Content -->
        <router-view :token="token" :user="user" />
      </md-app-content>

    </md-app>
  </div>
</template>

<style>
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-content {
  min-height: calc(100vh - 72px);
}

@media (max-width: 960px) {
  .md-content {
    min-height: calc(100vh - 48px);
  }
}

@media (max-width: 600px) {
  .md-content {
    min-height: calc(100vh - 56px);
  }
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
    menuVisible: false,
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
    },
  },
};
</script>
