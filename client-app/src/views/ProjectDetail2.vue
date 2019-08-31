<template>
  <div class="container">
    <div class="row">
      <div class="col title">
        <h1>{{project.title}}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8" style="background-color:#ececec;">
        <div class="row justify-content-center">
          <b-img
            src="https://qph.fs.quoracdn.net/main-qimg-5cb8123242dfc2b4d146c6ae154a30a0"
            alt="manycat"
            fluid
          />
        </div>
        <br />
        <br />
        <br />
        <div class="row">
          <div class="col">
            <div v-html="info.detail" style="font-family:RSU;"></div>
          </div>
        </div>
      </div>
      <!-- Donate card -->
      <div class="col-lg-4 text-center">
        <div class="card">
          <div class="progressvalue">
            <p>ยอดขณะนี้</p>
            <p>{{ project.balance | currency }}</p>
          </div>
          <div class="successvalue">
            <p style="font-family:RSU;">เป้าหมาย</p>
            <p style="font-family:RSU;">{{ project.goal | currency}}</p>
          </div>
          <div>
            <b-progress height="2rem" variant="success" animated>
              <b-progress-bar :value="percent">
                Progress:
                <strong>{{percent}}%</strong>
              </b-progress-bar>
            </b-progress>
          </div>
          <!-- donate button -->
          <a href="#donate">
            <button class="button-donate">
              <span>Donate</span>
            </button>
          </a>
          <br />
          <!-- sendto -->
          <div>
            <p style="font-family:RSU;">ส่งต่อ</p>
            <!-- Add font awesome icons -->
            <div class="effect aeneas">
              <div class="buttons">
                <a href="https://www.facebook.com/" class="fb" title="Join us on Facebook">
                  <i class="fa fa-facebook w3-xlarge" aria-hidden="true"></i>
                </a>
                <a href="https://www.twitter.com/" class="tw" title="Join us on Twitter">
                  <i class="fa fa-twitter w3-xlarge" aria-hidden="true"></i>
                </a>
                <a href="https://www.instagram.com/" class="ig" title="Join us on Instagram">
                  <i class="fa fa-instagram w3-xlarge" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col text-center">
        <h3>ประวัติการบริจาค</h3>
      </div>
    </div>
    <div class="row">
      <div class="col text-center">
        <div class="row">
          <b-table striped hover :items="donations" :fields="fields"></b-table>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col text-center" id="donate">
        <div v-if="project.status != 'closed'">
          <h3>ร่วมบริจาค</h3>
          <form @submit.prevent="onSubmit">
            <b-form-group label="ชื่อของคุณ" description="กรุณาใส่ชื่อของคุณ.">
              <b-form-input v-model="form.displayname" required placeholder="ใส่ชื่อของคุณ"></b-form-input>
            </b-form-group>

            <b-form-group label="จำนวนเงิน">
              <b-form-input
                v-model="form.amount"
                required
                type="number"
                :state="amountState"
                placeholder="จำนวนเงิน"
              ></b-form-input>
            </b-form-group>
            <button class="btn btn-info" :disabled="!amountState">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="false"
              ></span>
              Submit
            </button>
            <p>{{form}}</p>
            <p v-if="error">{{error}}</p>
          </form>
          <div class="col">
            <button
              class="btn btn-success"
              @click="createQR(1)"
              :disabled="!amountState"
            >promptpay QR</button>
            <button
              class="btn btn-success"
              @click="createQR(2)"
              :disabled="!amountState"
            >custom QR v2</button>
            <button
              class="btn btn-success"
              @click="createQR(3)"
              :disabled="!amountState"
            >custom QR v3</button>
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
      </div>
    </div>

    <div class="row">
      <div class="col-4">
        <div class="cardprofile">
          <img
            class="card-img-top"
            src="https://image.flaticon.com/icons/png/512/97/97895.png"
            alt="Card image"
            style="width:50%"
          />
          <div class="card-body">
            <h4 class="card-title">Doraemon,nobita</h4>
            <p class="card-text">Project owner</p>
            <a
              href="https://th.wikipedia.org/wiki/%E0%B9%82%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B9%80%E0%B8%AD%E0%B8%A1%E0%B8%AD%E0%B8%99"
              class="btn btn-primary stretched-link"
            >See Profile</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// const generatePayload = require("promptpay-qr");
// const qrcode = require("qrcode");
import auth from "../firebase";
const axios = require("axios");
const util = require("../util");
const API_IP = util.API_IP;
import socket from "../service/socket";
import service from "../service";

export default {
  data() {
    return {
      project: {},
      donations: {},
      info: {},
      form: {
        user: "", // user uid
        displayname: "", // user displayName
        amount: ""
      },
      currentUser: null,
      loading: false,
      loadingQR: false,
      svg: null,
      qrmessage: "",
      error: "",
      fields: [
        {
          key: "txid",
          sortable: false
        },
        {
          key: "amount",
          sortable: true
        },
        {
          key: "displayname"
        },
        {
          key: "time",
          sortable: true
        }
      ]
    };
  },
  computed: {
    amountState() {
      if (this.form.amount <= 0) {
        return false;
      } else {
        return true;
      }
    },
    percent() {
      return (this.project.balance / this.project.goal) * 100;
    }
  },
  methods: {
    getDetail: function(ID) {
      // from block
      service.getProjectByID(ID).then(project => {
        console.log("get data from block");
        this.project = project;
      });
      // from DB
      service.getProjectInfo(ID).then(info => {
        console.log("get data from DB");
        console.log(info);
        this.info = info;
      });
    },
    getDontions: function(ID) {
      service.getDonationHistory(ID).then(donations => {
        this.donations = donations;
      });
    },
    onSubmit: async function() {
      this.loading = true;
      let donation = {
        user: this.form.user,
        project: this.$route.params.id, // ID ของโครงการ
        amount: this.form.amount,
        displayname: this.form.displayname
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
        socket.emit("donate");
      } catch (err) {
        this.loading = false;
        this.error = err;
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
        this.qrmessage = "";
      } else {
        URL = `http://${API_IP}:8000/api/project/donate/qr/v3`;
        this.qrmessage = "แสกนโดยใช้มือถือของท่าน";
      }
      axios.default
        .post(URL, {
          amount: a || 50,
          user: this.form.user, // UID ของผู้ใช้งาน
          displayname: this.form.displayname,
          project: this.project.id
        })
        .then(res => {
          this.svg = res.data;
          this.loadingQR = false;
        });
    }
  },
  mounted() {
    // Check user
    auth.onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.form.displayname = user.displayName;
        this.form.user = user.uid; // UID of user.
        console.log("changed: " + JSON.stringify(user));
      } else {
        this.form.user = "";
      }
    });
    // Event listener
    socket.on("reload", () => {
      this.getDetail(this.project.id);
      this.getDontions(this.project.id);
      console.log("reloaded.");
    });
  },
  created() {
    // Get project and donation list
    const p_id = this.$route.params.id;
    this.getDetail(p_id);
    this.getDontions(p_id);
  }
};
</script>


<style scoped>
@import url("https://www.w3schools.com/w3css/4/w3.css");
/* @import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css'); */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");

.qr {
  align-content: center;
  align-self: center;
  height: 500px;
  width: 500px;
}
.title {
  padding: 1rem;
}
.shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

a + a {
  margin-left: 20px;
}
.progress {
  /* หลอดความสำเร็จ */
  height: 18px;
}
.progress {
  /* หลอดความสำเร็จ */
  width: 300px;
}
.progress {
  /* หลอดความสำเร็จ */
  right: 50px;
  top: 410px;
}
.progressmessage {
  /* ยอดขณะนี้ */
  font-size: 24px;
}

.progressvalue {
  /* ยอดขณะนี้ int */
  font-size: 34px;
}

.successmessage {
  /* ยอดที่ต้องการ */
  font-size: 24px;
}

.successvalue {
  /* ยอดที่ต้องการ int */
  font-size: 34px;
}

.column {
  /* พื้นหลังเนื้อหา Left column */
  float: left;
  /* width: 25%; */
  padding: 0 10px;
}

/* Responsive columns */
@media screen and (max-width: 600px) {
  .column {
    width: 100%;
    display: block;
    margin-bottom: 20px;
  }
}

/* Style the counter cards */

.card {
  /* card ของ ยอด donate */
  border: 2px solid #ff8d1e; /*กรอบของ card*/
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 10px;
  /* text-align: center; */
  background-color: #eeecec;
  /* position */
  /* position: absolute; */
  /* size */
  /* top: 72px; */
  /* right: 10px; */
  /* height: 600px; */
  /* width: 440px; */
}

.cardprofile {
  /* card profile project owner */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 16px;
  text-align: center;
  background-color: #f1f1f1;
}

.button-donate {
  /*  Donate button */
  border-radius: 4px;
  background-color: #f4511e;
  border: none;
  color: #ffffff;
  text-align: center;
  font-size: 20px;
  padding: 10px;
  /* width: 120px; */
  /* height: 50px; */
  transition: all 0.5s;
  cursor: pointer;
  margin: 5px;
}
.button-donate span {
  cursor: pointer;
  display: inline-block;
  transition: 0.5s;
}

.button-donate span:after {
  content: "\00bb";
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.button-donate:hover span {
  padding-right: 25px;
}

.button-donate:hover span:after {
  opacity: 1;
  right: 0;
}

.detail {
  /* รายละเอียดโครงการ */
  font-size: 16px;
}
/* social icon */
.fb:hover {
  color: #3b5998;
}
.tw:hover {
  color: #55acee;
}
.ig:hover {
  color: #d6249f;
}
</style>