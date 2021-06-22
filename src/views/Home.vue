<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col class="text-center">

      <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <p v-if="user">Hello {{ user.username }}</p>
        <scanner />
      </div>

    </v-col>
  </v-row>
</template>

<script>
import Scanner from '@/components/Scanner.vue';

export default {
  name: 'Home',
  props: {
    token: String,
    user: Object,
  },
  components: {
    Scanner,
  },
};
</script>
