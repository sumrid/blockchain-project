<template>
  <div>
    <!-- profile image -->
    <div>
      <div class="row">
        <div class="col">
          <div class="fb-profile">
            <img
              align="left"
              class="fb-image-lg"
              src="@/assets/cover2.jpg"
              alt="Profile image example"
            />
            <img
              align="left"
              class="fb-image-profile"
              src="@/assets/user.png"
              alt="Profile image example"
            />
            <div class="fb-profile-text">
              <h1>{{getUser.displayName}}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <b-card no-body>
            <b-tabs pills card vertical>
              <b-tab title="ข้อมูลส่วนตัว" active>
                <edit-profile></edit-profile>
              </b-tab>

              <b-tab title="ยืนยันตัวตน">
                <verify></verify>
              </b-tab>

              <b-tab title="การบริจาค">
                <p>ประวัติการบริจาค</p>
                <div class="row">
                  <div class="col" v-if="Boolean(donations)">
                    <b-table striped hover :items="donations" :fields="donationFields">
                      <template v-slot:cell(invoice)="data">
                        <b-button variant="outline-primary" size="sm" :to="{ name: 'invoice-view', params: { txid: data.item.txid }}">รายละเอียด</b-button>
                      </template>
                    </b-table>
                  </div>
                  <div class="col" v-else>
                    <p class="text-center">ยังไม่มีการบริจาค</p>
                  </div>
                </div>
              </b-tab>

              <b-tab title="โครงการ" v-if="isCreator">
                <b-tabs content-class="mt-3">
                  <b-tab title="โครงการของฉัน">
                    <p>โครงการของฉัน</p>
                    <project v-for="(item, index) in myprojects" :key="index" :id="item.id"></project>
                  </b-tab>

                  <b-tab title="โครงการที่รับบริจาค">
                    <p>โครงการที่บริจาค</p>
                    <b-table-simple hover responsive>
                      <b-thead>
                        <b-tr>
                          <b-th>ชื่อ</b-th>
                          <b-th>สถานะ</b-th>
                          <b-th>วันที่สร้าง</b-th>
                          <b-th>more</b-th>
                        </b-tr>
                      </b-thead>
                      <b-tbody>
                        <b-tr v-for="(item, index) in myReceive" :key="index.id">
                          <b-td>{{item.title}}</b-td>
                          <b-td>{{item.status}}</b-td>
                          <b-td>{{item.starttime}}</b-td>
                          <b-td>
                            <router-link
                              :to="{ name: 'confrimReceive', params: {id: item.id}}"
                              v-if="item.status == 'pending'"
                            >
                              <b-button variant="warning">กดยอมรับ</b-button>
                            </router-link>
                            <router-link :to="{ name: 'project', params: { id: item.id }}">page</router-link>
                          </b-td>
                        </b-tr>
                      </b-tbody>
                    </b-table-simple>
                  </b-tab>

                  <!--
                  <b-tab title="ตรวจสอบความเคลื่อนไหว">
                    <p>ตรวจสอบความเคลื่อนไหว</p>
                  </b-tab>
                  -->
                </b-tabs>

                <div class="row">
                  <router-link to="createproject" v-if="isCreator">
                    <button class="btn">
                      <icon :icon="iconPlus" />สร้างโครงการ
                    </button>
                  </router-link>
                </div>
              </b-tab>
            </b-tabs>
          </b-card>
        </div>

        <!-- confirm modal -->
        <b-modal id="confirm-project">
          <confirm-project />
        </b-modal>

        <!-- information -->
        <!-- <div class="col-lg-4 col-md-12">
          <div class="panel panel-default">
            <div class="menu_title">Profile</div>
            <div class="panel-body">
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label for="email">Place of Birth:</label>
                    <p>pune, maharashtra</p>
                  </div>
                  <div class="form-group">
                    <label for="email">Date of Birth:</label>
                    <p>26 Sep 2017</p>
                  </div>
                  <div class="form-group">
                    <label for="email">Time of Birth:</label>
                    <p>11:20 min.</p>
                  </div>
                  <div class="form-group">
                    <label for="email">Horroscoe Match not Necessory</label>
                  </div>
                  <div class="form-group">
                    <label for="email">Sun Sign:</label>
                    <p>Scorpio</p>
                  </div>
                  <div class="form-group">
                    <label for="email">Rashi/ Moon sign:</label>
                    <p>Mesh</p>
                  </div>
                  <div class="form-group">
                    <label for="email">Nakshtra:</label>
                    <p>Bharani</p>
                  </div>
                  <div class="form-group">
                    <label for="email">Manglik:</label>
                    <p>Manglik</p>
                  </div>
                  <button type="button" class="btn btn-dark">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import Verify from "./Verify";
import auth from "../../firebase";
import { mapGetters } from "vuex";
import service from "../../service";
import EditProfile from "./EditProfile";
import Project from "../../components/MyProject";
import confirmProject from "../receiver/ConfirmProject";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default {
  components: {
    confirmProject,
    EditProfile,
    Project,
    Verify
  },
  data() {
    return {
      profile: {},
      donations: [],
      myReceive: [],
      isCreator: false,
      myprojects: [],
      donationFields: [
        {
          key: "project"
        },
        {
          key: "amount",
          sortable: true
        },
        {
          key: "time",
          sortable: true
        },
        {
          key: "invoice",
          label: "ใบเสร็จ"
        }
      ],
      iconPlus: faPlus
    };
  },
  created() {
    document.title = "Donate-web | ข้อมูลของฉัน";
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.getDonations(user.uid);
        this.getMyProject(user.uid);
        this.getMyReceive(user.uid);
        this.getProfile(user.uid);
      } else {
        if (this.$route.name == "me") this.$router.replace("/");
      }
    });
  },
  methods: {
    async getDonations(id) {
      this.donations = await service.getDonationByUserID(id);
    },
    async getMyProject(id) {
      this.myprojects = await service.getMyProject(id);
    },
    async getMyReceive(id) {
      this.myReceive = await service.getMyReceive(id);
    },
    async getProfile(id) {
      this.profile = await service.getUserInfo(id);
      const role = this.profile.role;
      this.isCreator = role.includes("creator");
    }
  },
  computed: {
    ...mapGetters(["getUser"])
  }
};
</script>

<style>
/* @import url("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"); */
/* @import url("https://www.w3schools.com/w3css/4/w3.css"); */

/* สไลด์รูป */
.mySlides {
  display: none;
}

/* =============================
      Author's custom styles
   ============================= */

body {
  font-family: "Open Sans", sans-serif;
}

.fb-profile img.fb-image-lg {
  z-index: 0;
  width: 100%;
  height: 50%;
  margin-bottom: 10px;
}

.fb-image-profile {
  margin: -90px 10px 20px 80px;
  z-index: 9;
  width: 10rem;
}

/***
Bootstrap Line Tabs by @keenthemes
A component of Metronic Theme - #1 Selling Bootstrap 3 Admin Theme in Themeforest: http://j.mp/metronictheme
Licensed under MIT
***/

/* Tabs panel */
.tabbable-panel {
  border: 1px solid #eee;
  padding: 10px;
}

/* Default mode */
.tabbable-line > .nav-tabs {
  border: none;
  margin: 0px;
}

.tabbable-line > .nav-tabs > li {
  margin-right: 2px;
}

.tabbable-line > .nav-tabs > li > a {
  border: 0;
  margin-right: 0;
  color: #737373;
}

.tabbable-line > .nav-tabs > li > a > i {
  color: #a6a6a6;
}

.tabbable-line > .nav-tabs > li.open,
.tabbable-line > .nav-tabs > li:hover {
  border-bottom: 4px solid #fbcdcf;
}

.tabbable-line > .nav-tabs > li.open > a,
.tabbable-line > .nav-tabs > li:hover > a {
  border: 0;
  background: none !important;
  color: #333333;
}

.tabbable-line > .nav-tabs > li.open > a > i,
.tabbable-line > .nav-tabs > li:hover > a > i {
  color: #a6a6a6;
}

.tabbable-line > .nav-tabs > li.open .dropdown-menu,
.tabbable-line > .nav-tabs > li:hover .dropdown-menu {
  margin-top: 0px;
}

.tabbable-line > .nav-tabs > li.active {
  border-bottom: 4px solid #f4511e;
  position: relative;
}

.tabbable-line > .nav-tabs > li.active > a {
  border: 0 !important;
  color: #333333;
}

.tabbable-line > .nav-tabs > li.active > a > i {
  color: #404040;
}

.tabbable-line > .tab-content {
  margin-top: -3px;
  background-color: #fff;
  border: 0;
  border-top: 1px solid #eee;
  padding: 15px 0;
}

.portlet .tabbable-line > .tab-content {
  padding-bottom: 0;
}

/* Below tabs mode */

.tabbable-line.tabs-below > .nav-tabs > li {
  border-top: 4px solid transparent;
}

.tabbable-line.tabs-below > .nav-tabs > li > a {
  margin-top: 0;
}

.tabbable-line.tabs-below > .nav-tabs > li:hover {
  border-bottom: 0;
  border-top: 4px solid #fbcdcf;
}

.tabbable-line.tabs-below > .nav-tabs > li.active {
  margin-bottom: -2px;
  border-bottom: 0;
  border-top: 4px solid #f4511e;
}

.tabbable-line.tabs-below > .tab-content {
  margin-top: -10px;
  border-top: 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.menu_title {
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
  margin: 0 5px;
}

.btn:hover {
  background-color: #f4511e;
}
</style>