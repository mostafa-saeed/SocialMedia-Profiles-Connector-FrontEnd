<template>
  <div class="about">
    <h1>This is an about page {{ test }}</h1>
    <button v-on:click="idk">IDK</button>
  </div>
</template>
<script>
export default {
  data: () => ({
    test: '',
  }),
  methods: {
    idk() {
      console.log('testing', process.env);
      this.test = 123;
    },
  },
};
</script>
