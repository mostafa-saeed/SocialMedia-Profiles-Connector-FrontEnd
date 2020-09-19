<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="isValid">
            <v-text-field
              label="Login"
              name="login"
              prepend-icon="mdi-account"
              type="text"
              :rules="validationRules.login"
              v-model="login"
            ></v-text-field>

            <v-text-field
              id="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              :rules="validationRules.password"
              v-model="password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit" :disabled="!isValid">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>
import sendRequest from '@/services/api';

export default {
  name: 'Login',
  data: () => ({
    login: '',
    password: '',
    isValid: false,
    validationRules: {
      login: [
        (v) => !!v || 'Username/Email is required',
      ],
      password: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 8) || 'Password must have 8+ characters',
      ],
    },
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
