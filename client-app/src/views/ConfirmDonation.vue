<template>
  <div class="container">
    <h1>Confirm donation</h1>
    <div class="row">
      <p>จำนวน : {{donation.amount | currency}}</p>
      <p>result {{donation}}</p>
    </div>
    <button class="btn btn-success" @click="onSubmit">
      <span
        v-if="loading"
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="false"
      ></span>
      ยืนยันการบริจาค
    </button>
    <h3 v-if="error">{{error}}</h3>
  </div>
</template>

<script>
const axios = require("axios");
const util = require("../util");
export default {
  data() {
    return {
      donation: this.$route.query,
      error: "",
      loading: false
    };
  },
  methods: {
    onSubmit: async function() {
      this.loading = true;
      const API_IP = util.API_IP;
      try {
        // ทำการบริจาค
        await axios.default.post(
          `http://${API_IP}:8000/api/project/donate`,
          this.donation
        );
        this.loading = false;
        this.$router.replace({
            name: 'detail',
            params: {id: this.donation.project}
        });
      } catch (err) {
        this.loading = false;
        this.error = err;
        console.error(err);
      }
    }
  }
};
</script>