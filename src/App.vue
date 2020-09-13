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

          <router-link to="/login" exact>
            <md-list-item>
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Login</span>
            </md-list-item>
          </router-link>

          <router-link to="/register" exact>
            <md-list-item>
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Register</span>
            </md-list-item>
          </router-link>

        </md-list>
      </md-app-drawer>

      <md-app-content>
        <!-- Content -->
        <router-view/>
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
export default {
  data: () => ({
    menuVisible: false,
  }),
};
</script>
