<template>
  <div class="container">
    <h2>รายละเอียด... {{project.title}}</h2>
    <div class="row">
      <div>
        ยอดเงินปัจจุบัน : {{project.balance}}
        <br />
        เจ้าของ : {{project.owner}}
      </div>
    </div>
    <h3>ประวัติการบริจาค</h3>
    <div class="row">
      <table class="table">
        <thead>
          <tr>
            <th>txID</th>
            <th>ชื่อ</th>
            <th>จำนวน</th>
            <th>เวลา</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in donations" v-bind:key="d.id">
            <td>{{d.txid}}</td>
            <td>{{d.user}}</td>
            <td>{{d.amount}}</td>
            <td>{{d.time}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>ร่วมบริจาค</h3>
    <b-form @submit="onSubmit">
      <b-form-group
        label="ชื่อของคุณ"
        description="We'll never share your email with anyone else."
      />
      <b-form-input v-model="form.user" required placeholder="ใส่ชื่อของคุณ"></b-form-input>

      <b-form-group label="จำนวนเงิน">
        <b-form-input v-model="form.amount" required placeholder="จำนวนเงิน"></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="false"
        ></span>
        Submit
      </b-button>
    </b-form>
    <button @click="createQR">QR</button>
    <div class="qr" v-html="svg"></div>
  </div>
</template>

<script>
// const generatePayload = require("promptpay-qr");
// const qrcode = require("qrcode");
const axios = require("axios");

export default {
  data() {
    return {
      project: {},
      donations: [],
      form: {
        user: "",
        amount: null
      },
      loading: false,
      svg: null
    };
  },
  methods: {
    getDetail: function() {
      const p_id = this.$route.params.id;
      axios.default.get("http://localhost:8000/api/query/" + p_id).then(res => {
        this.project = res.data;
      });
    },
    getDontions: function() {
      const p_id = this.$route.params.id;
      axios.default
        .get("http://localhost:8000/api/project/donations/" + p_id)
        .then(res => {
          console.log(res.data);
          this.donations = res.data;
        });
    },
    onSubmit: function() {
      this.loading = true;
      let donation = {
        user: this.form.user,
        project: this.$route.params.id,
        amount: this.form.amount
      };
      console.log("[onSubmit] " + donation.project);

      axios.default
        .post("http://localhost:8000/api/project/donate", donation)
        .then(res => {
          this.loading = false;
          console.log(res.data);
          this.getDetail();
          this.getDontions();
        });
    },
    createQR: function() {
      console.log(this.form.amount);
      const a = parseFloat(this.form.amount);
      axios.default
        .post("http://localhost:8000/api/project/donate/qr", {
          amount: a || 50
        })
        .then(res => {
          this.svg = res.data;
          console.log(res.data);
        });
    }
  },
  beforeCreate() {
    const p_id = this.$route.params.id;
    axios.default.get("http://localhost:8000/api/query/" + p_id).then(res => {
      console.log(res.data);
      this.project = res.data;
    });

    axios.default
      .get("http://localhost:8000/api/project/donations/" + p_id)
      .then(res => {
        console.log(res.data);
        this.donations = res.data;
      });
  }
};
</script>

<style scoped>
.qr {
  align-content: center;
  align-self: center;
  height: 500px;
  width: 500px;
}
</style>

