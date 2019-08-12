<template>
  <div class="container">
    <h2>รายละเอียด... {{project.title}}</h2>
    <div class="row">
      <div>
        <h3>ยอดเงินปัจจุบัน</h3>
        : {{project.balance | currency}}
        <br />
        <strong>เจ้าของ</strong>
        : {{project.owner}}
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
    <form @submit.prevent="onSubmit">
      <b-form-group label="ชื่อของคุณ" description="กรุณาใส่ชื่อของคุณ.">
        <b-form-input v-model="form.user" required placeholder="ใส่ชื่อของคุณ"></b-form-input>
      </b-form-group>

      <b-form-group label="จำนวนเงิน">
        <b-form-input v-model="form.amount" required placeholder="จำนวนเงิน"></b-form-input>
      </b-form-group>
      <button class="btn btn-info" :disabled="!form.amount">
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="false"
        ></span>
        Submit
      </button>
    </form>
    <div class="col">
      <button class="btn btn-success" @click="createQR(1)" :disabled="!form.amount">promptpay QR</button>
      <button class="btn btn-success" @click="createQR(2)" :disabled="!form.amount">custom QR v2</button>
      <button class="btn btn-success" @click="createQR(3)" :disabled="!form.amount">custom QR v3</button>
    </div>
    <br />
    <span
      v-if="loadingQR"
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="false"
    ></span>
    <p v-if="qrmessage">{{qrmessage}}</p>
    <div class="container qr" v-html="svg"></div>
  </div>
</template>

<script>
// const generatePayload = require("promptpay-qr");
// const qrcode = require("qrcode");
const axios = require("axios");
const util = require("../util");
const API_IP = util.API_IP;

export default {
  data() {
    return {
      project: {},
      donations: {},
      form: {
        user: "",
        amount: ""
      },
      loading: false,
      loadingQR: false,
      svg: null,
      qrmessage: ""
    };
  },
  methods: {
    getDetail: function(ID) {
      axios.default.get(`http://${API_IP}:8000/api/query/` + ID).then(res => {
        this.project = res.data;
      });
    },
    getDontions: function(ID) {
      axios.default
        .get(`http://${API_IP}:8000/api/project/donations/` + ID)
        .then(res => {
          console.log(res.data);
          this.donations = res.data;
        });
    },
    onSubmit: async function() {
      this.loading = true;
      // TODO ใช้เป็น userid แทนในการเก็บลอง blockchain
      let donation = {
        user: this.form.user,
        project: this.$route.params.id,
        amount: this.form.amount
      };
      console.log("[onSubmit] " + donation.project);

      try {
        // ทำการบริจาค
        await axios.default.post(
          `http://${API_IP}:8000/api/project/donate`,
          donation
        );
        this.loading = false;
        this.getDetail(donation.project);
        this.getDontions(donation.project);
      } catch (err) {
        console.error(err);
      }
    },
    createQR: function(version) {
      this.loadingQR = true;
      const a = parseFloat(this.form.amount);
      let URL = "";
      if (version == 1) {
        URL = `http://${API_IP}:8000/api/project/donate/qr/`; // v1 promptpay
        this.qrmessage = "พร้อมเพย์ สามารถแสกนได้ผ่านทาง application ของธนาคาร";
      } else if (version == 2) {
        URL = `http://${API_IP}:8000/api/project/donate/qr/v2`;
      } else {
        URL = `http://${API_IP}:8000/api/project/donate/qr/v3`;
        this.qrmessage = "แสกนโดยใช้มือถือของท่าน";
      }
      axios.default
        .post(URL, {
          amount: a || 50,
          user: this.form.user, // TODO change to user id
          project: this.project.id
        })
        .then(res => {
          this.svg = res.data;
          this.form = { user: "", amount: "" };
          this.loadingQR = false;
        });
    }
  },
  created() {
    // Get project and donation list
    const p_id = this.$route.params.id;
    axios.default.get(`http://${API_IP}:8000/api/query/` + p_id).then(res => {
      console.log(res.data);
      this.project = res.data;
    });

    axios.default
      .get(`http://${API_IP}:8000/api/project/donations/` + p_id)
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
