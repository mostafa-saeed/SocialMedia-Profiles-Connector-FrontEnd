<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Register</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="isValid">
            <v-progress-linear indeterminate color="primary" v-if="loading"></v-progress-linear>

            <v-text-field
              label="Username"
              name="username"
              prepend-icon="mdi-account"
              type="text"
              :rules="validationRules.username"
              v-model="username"
            ></v-text-field>

            <v-text-field
              label="Email"
              name="email"
              prepend-icon="mdi-email"
              type="email"
              :rules="validationRules.email"
              v-model="email"
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

            <v-text-field
              id="repassword"
              label="Retype Password"
              name="repassword"
              prepend-icon="mdi-lock"
              type="password"
              :rules=[matchedPasswords]
              v-model="repassword"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit" :disabled="!isValid">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>
import sendRequest from '@/services/api';

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      repassword: '',
      isValid: false,
      loading: false,
      validationRules: {
        username: [
          (v) => !!v || 'Username is required',
        ],
        email: [
          (v) => !!v || 'Email is required',
          (v) => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        password: [
          (v) => !!v || 'Password is required',
          (v) => (v && v.length >= 8) || 'Password must have 8+ characters',
        ],
      },
    };
  },

  computed: {
    matchedPasswords() {
      return this.password === this.repassword || 'Mismatched passwords!';
    },
  },

  methods: {
    async submit(e) {
      e.preventDefault();
      this.loading = true;

      try {
        const { username, email, password } = this;
        const { token, user } = await sendRequest('POST', 'users', {
          username, email, password,
        });
        this.loading = false;

        this.$root.login(token, user);
      } catch (error) {
        alert(error);
        this.loading = false;
      }
    },
  },
};
</script>
