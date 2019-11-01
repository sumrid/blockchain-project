<template>
  <div>
    <!-- info -->
    <div class="container">
      <div class="row">
        <div class="col title">
          <h1 class="text-center">{{project.title}}</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-8">
          <div class="row justify-content-center">
            <b-img :src="info.image" fluid rounded />
          </div>
        </div>
        <!-- Donate card ด้านข้าง -->
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
            <button class="button-donate" @click.prevent="scrollToDonate">
              <span>Donate</span>
            </button>
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

      <!-- Tab -->
      <div class="row">
        <div class="col">
          <b-tabs content-class="mt-3">
            <b-tab title="รายละเอียดโครงการ" active>
              <div v-html="info.detail"></div>
            </b-tab>
            <b-tab title="ค่าใช้จ่ายโครงการ">
              <b-table-simple class="table table-striped table-condensed">
                <thead>
                  <tr>
                    <th>ลำดับค่าใช้จ่าย</th>
                    <th>ชื่อรายการ</th>
                    <th>จำนวน</th>
                    <th>มูลค่าต่อหน่วย</th>
                    <th>รวมมูลค่า</th>
                    <th>สถานะการใช้</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>ค่าธรรมเนียมเว็บไซต์</td>
                    <td>1</td>
                    <td>1000</td>
                    <td>1000</td>
                    <td>
                      <span class="label label-success">Active</span>
                    </td>
                  </tr>
                  <tr v-for="(inv, index) in invoices" :key="index">
                    <td>{{inv.id}}</td>
                    <td>xxx</td>
                    <td>xxx</td>
                    <td>xxx</td>
                    <td>{{inv.total | currency}}</td>
                    <td>
                      <b-button v-b-toggle="inv.id" variant>รายละเอียด</b-button>
                    </td>
                    <div>
                      <b-collapse :id="inv.id">
                        <b-card>{{inv}}</b-card>
                      </b-collapse>
                    </div>
                  </tr>
                </tbody>
              </b-table-simple>
            </b-tab>
            <b-tab title="ความเคลื่อนไหวโครงการ">
              <!--
              <div class="activity-feed">
                <div class="feed-item" v-for="(e, index) in events" :key="index">
                  <div class="col-md-8 col-sm-12 col-xs-12 morningdetail">
                    <div class="col-md-8 col-sm-2 col-xs-8">
                      <h5>
                        <span style="color:#E2B104;" class="text-uppercase">{{e.event}}</span>
                      </h5>
                    </div>

                    <div class="col-md-4 col-sm-10 col-xs-4">
                      <h5 style="color: #E2B104;">
                        เมื่อเวลา:
                        <span style="color: #B7B7B7">{{unixToDate(e.timestamp)}}</span>
                      </h5>
                    </div>

                    <div class="col-md-12 col-xs-12">
                      <h5 style="color: white; font-weight: normal;">
                        <span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
                        <span style="color: #B7B7B7">Mohali, Punjab</span>
                      </h5>
                    </div>

                    <div class="col-md-12 col-sm-12 col-xs-12">
                      <p style="color:#B7B7B7 ">{{e.message}}</p>
                    </div>
                  </div>
                </div>
              </div>
              -->
              <events :events="events" />
            </b-tab>
            <b-tab title="ติดต่อโครงการ">
              <h3 class="text-center text-uppercase">contact us</h3>
              <p class="text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris interdum purus at
                sem
                ornare sodales. Morbi leo nulla, pharetra vel felis nec, ullamcorper condimentum quam.
              </p>
              <div class="row">
                <div class="col">
                  <div class="cardprofile">
                    <img
                      class="card-img-top"
                      src="https://cdnb.artstation.com/p/assets/images/images/010/966/743/large/von-vincent-sison-doraemon-nobita.jpg?1527169782"
                      alt="Card image"
                      style="width:50%"
                    />
                    <div class="card-body">
                      <h4 class="card-title">{{owner.name}}</h4>
                      <p class="card-text">Project owner</p>
                      <router-link :to="{name: 'owner', params: { id: owner.uid } }">
                        <a href class="btn btn-primary">See Profile</a>
                      </router-link>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="cardprofile">
                    <img
                      class="card-img-top"
                      src="https://cdn2.vectorstock.com/i/1000x1000/25/31/user-icon-businessman-profile-man-avatar-vector-10552531.jpg"
                      alt="Card image"
                      style="width:50%"
                    />
                    <div class="card-body">
                      <h4 class="card-title">{{receiver.name}}</h4>
                      <p class="card-text">Project reciever</p>
                      <a href class="btn btn-primary">See Profile</a>
                    </div>
                  </div>
                </div>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>

      <!-- donation history -->
      <div class="row">
        <div class="col text-center m-4">
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
    </div>

    <!-- donation input -->
    <div class="container-fluid donate-container">
      <div class="container">
        <div class="row">
          <div class="col text-center m-4">
            <h3>ร่วมบริจาค</h3>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-3 col-sm-6">
            <div class="pricingTable">
              <div class="pricingTable-header">
                <span class="heading">
                  <h3>Lv.10</h3>
                </span>
                <span class="price-value">
                  100 baht
                  <span class="month">10 ชิ้น</span>
                </span>
              </div>
              <div>
                <b-button block @click="form.amount = 100">Donate</b-button>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="pricingTable">
              <div class="pricingTable-header">
                <span class="heading">
                  <h3>Lv.20</h3>
                </span>
                <span class="price-value">
                  200 baht
                  <span class="month">20 ชิ้น</span>
                </span>
              </div>
              <div class="pricingTable-sign-up">
                <b-button block @click="form.amount = 200">Donate</b-button>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="pricingTable">
              <div class="pricingTable-header">
                <span class="heading">
                  <h3>Lv.50</h3>
                </span>
                <span class="price-value">
                  500 baht
                  <span class="month">50 ชิ้น</span>
                </span>
              </div>
              <div class="pricingTable-sign-up">
                <b-button block @click="form.amount = 500">Donate</b-button>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="pricingTable">
              <div class="pricingTable-header">
                <span class="heading">
                  <h3>Lv.99</h3>
                </span>
                <span class="price-value">
                  1000 baht
                  <span class="month">100 ชิ้น</span>
                </span>
              </div>
              <div class="pricingTable-sign-up">
                <b-button block @click="form.amount = 1000">Donate</b-button>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col">
            <credit-card-field v-model="card"></credit-card-field>
            <!-- 
            <inline-credit-card-field v-model="form.card"></inline-credit-card-field>
            -->
          </div>
        </div>

        <!-- form input -->
        <div class="row">
          <div class="col text-center">
            <div>
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
              <div class="container qr" v-if="svg" v-html="svg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div>
      <my-footer />
    </div>
  </div>
</template>

<script>
import myFooter from "@/components/Footer";
import Events from "../components/EventItem";
import auth from "@/firebase";
const axios = require("axios");
import { API_IP, PROTOCOL } from "@/util";
import socket from "@/service/socket";
import service from "@/service";
import moment from "moment";
import credit from "vue-credit-card-field";

export default {
  components: {
    Events,
    myFooter,
    CreditCardField: credit.CreditCardField,
    InlineCreditCardField: credit.InlineCreditCardField
  },
  data() {
    return {
      info: {},
      owner: {},
      events: [],
      project: {},
      receiver: {},
      invoices: [],
      donations: {},
      form: {
        user: "", // user uid
        amount: "",
        displayname: "" // user displayName
      },
      card: {},
      svg: null,
      error: "",
      loading: false,
      qrmessage: "",
      loadingQR: false,
      currentUser: null,
      eventsFields: [
        {
          key: "event"
        },
        {
          key: "message"
        },
        {
          key: "timestamp",
          sortable: true
        }
      ],
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
  watch: {
    project: function() {
      this.getUserProfile(this.project.owner, this.project.receiver);
    }
  },
  methods: {
    getUserProfile: async function(owner, receiver) {
      this.owner = await service.getUserInfo(owner);
      this.receiver = await service.getUserInfo(receiver);
    },
    unixToDate(unix) {
      return moment.unix(unix).format("LL");
    },
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
        document.title = "Donate-web | " + this.info.title;
      });
    },
    getDontions: function(ID) {
      service.getDonationHistory(ID).then(donations => {
        this.donations = donations;
      });
    },
    getEvents: function(ID) {
      service.getEvents(ID).then(events => {
        this.events = events;
      });
    },
    getInvoice: function(ID) {
      service.getInvoice(ID).then(inv => {
        this.invoices = inv;
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
          `${PROTOCOL}//${API_IP}:8000/api/project/donate`,
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
        URL = `${PROTOCOL}//${API_IP}:8000/api/project/donate/qr/`; // v1 promptpay
        this.qrmessage = "พร้อมเพย์ สามารถแสกนได้ผ่านทาง application ของธนาคาร";
      } else if (version == 2) {
        URL = `${PROTOCOL}//${API_IP}:8000/api/project/donate/qr/v2`;
        this.qrmessage = "";
      } else {
        URL = `${PROTOCOL}//${API_IP}:8000/api/project/donate/qr/v3`;
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
    },
    scrollToDonate() {
      document.getElementById("donate").scrollIntoView();
    }
  },
  mounted() {
    // Check user
    auth.onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.form.displayname = user.displayName;
        this.form.user = user.uid; // UID of user.
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
    this.getEvents(p_id);
    this.getInvoice(p_id);
  }
};
</script>


<style scoped>
.donate-container {
  background-color: #fcf2e0
}
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

/* Style the counter cards */

.card {
  /* card ของ ยอด donate */
  border: 2px solid #ff8d1e;
  /*กรอบของ card*/
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 16px;
  margin: 1rem;
  border-radius: 10px;
  background-color: #fff4f4;
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

/* -------------- pricing ----------------- */
.pricingTable {
  text-align: center;
  border-radius: 8px;
  overflow: hidden;
}

.pricingTable .pricingTable-header {
  background: #152a38;
}

.pricingTable .heading {
  display: block;
  padding: 15px 0;
}

.pricingTable .heading:after {
  content: "";
  width: 28%;
  border-top: 1px solid #7c888f;
  display: block;
  margin: 15px auto 0;
}

.pricingTable .heading h3 {
  font-size: 24px;
  color: #fff;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 2px;
}

.pricingTable .price-value {
  font-size: 35px;
  color: #fff;
  padding: 10px 0 30px 0;
  display: block;
}

.pricingTable .month {
  display: block;
  font-size: 16px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-top: 15px;
  color: #7f909a;
}

.pricingTable .btn {
  font-size: 22px;
  background: #eab01b;
  border: none;
  border-radius: 0;
  padding: 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/**
 */
.pricingTable .btn:after {
  content: ">>";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  margin-left: 5px;
  opacity: 0;
  transition: all 0.5s ease 0s;
}

.pricingTable:hover .btn:after {
  opacity: 1;
}

@media screen and (max-width: 990px) {
  .pricingTable {
    margin-bottom: 20px;
  }
}

.ql-align-center {
  background: #000;
}

p.ql-align-center {
  background: #000;
}

div>p.ql-align-center {
  background: #000;
}

</style>