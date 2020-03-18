<template>
  <div class="container">
    <div v-if="!isSuccess">
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

    <div v-if="isSuccess">
      <h2>สำเร็จแล้ว</h2>
    </div>
  </div>
</template>

<script>
import socket from "../service/socket";
import service from '../service';

export default {
  data() {
    return {
      donation: this.$route.query,
      error: "",
      loading: false,
      isSuccess: false
    };
  },
  methods: {
    onSubmit: async function() {
      this.loading = true;
      try {
        // ทำการบริจาค
        await service.donate(this.donation);
        this.loading = false;
        this.isSuccess = true;
        socket.emit('donate');
        // this.$router.replace({ // ส่งไปหน้าโครงการ
        //   name: "detail",
        //   params: { id: this.donation.project }
        // });
      } catch (err) {
        this.loading = false;
        this.error = err;
        console.error(err);
      }
    }
  }
};
</script>