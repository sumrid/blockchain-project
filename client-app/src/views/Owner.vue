<template>
  <div>
    <div>
      <div class="row">
        <div class="col">
          <div class="fb-profile">
            <!-- background picture -->
            <img
              align="left"
              class="fb-image-lg"
              src="@/assets/cover.jpg"
              alt="Profile image example"
            />
            <!-- profile picture -->
            <img
              align="left"
              class="fb-image-profile thumbnail"
              src="@/assets/user.png"
              alt="Profile image example"
            />
            <div class="fb-profile-text">
              <h1>{{ownerInfo.name}}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-sm-8">
          <b-tabs card>
            <b-tab title="ระดับความน่าเชื่อถือ" active>
              <span class="heading">User Rating</span>
              <star :rating="rating.avg_rating" :increment="0.01" read-only></star>
              <small>จากผู้ใช้ {{rating.num_rating}} คน</small>
              <div class="row">
                <div class="col-2">
                  <p>5 star</p>
                </div>
                <div class="col-10">
                  <b-progress :value="rating.five_star" :max="rating.num_rating" variant="success"></b-progress>
                </div>
              </div>
              <div class="row">
                <div class="col-2">
                  <p>4 star</p>
                </div>
                <div class="col-10">
                  <b-progress :value="rating.four_star" :max="rating.num_rating" variant="success"></b-progress>
                </div>
              </div>
              <div class="row">
                <div class="col-2">
                  <p>3 star</p>
                </div>
                <div class="col-10">
                  <b-progress :value="rating.three_star" :max="rating.num_rating" variant="success"></b-progress>
                </div>
              </div>
              <div class="row">
                <div class="col-2">
                  <p>2 star</p>
                </div>
                <div class="col-10">
                  <b-progress :value="rating.two_star" :max="rating.num_rating" variant="success"></b-progress>
                </div>
              </div>
              <div class="row">
                <div class="col-2">
                  <p>1 star</p>
                </div>
                <div class="col-10">
                  <b-progress :value="rating.one_star" :max="rating.num_rating" variant="success"></b-progress>
                </div>
              </div>

              <hr />
              <!-- login แล้ว -->
              <b-card title="ให้คะแนน" v-if="getUser">
                <star :star-size="20" v-model="form.rate"></star>
                <p v-if="form.rate">คุณเลือก {{form.rate}} คะแนน</p>
                <b-button
                  variant="success"
                  :disabled="!form.rate"
                  @click="sumbitRate"
                  v-if="!isLoading"
                >ให้คะแนน</b-button>
                <b-button variant="success" disabled v-else>
                  <b-spinner small type="grow" label="Loading..."></b-spinner>กำลังให้คะแนน
                </b-button>
              </b-card>

              <!-- ยังไม่ login -->
              <b-card title="ให้คะแนน" v-else>
                <b-alert show variant="warning">กรุณาเข้าสู่ระบบเพื่อทำการให้คะแนน</b-alert>
                <star :star-size="20" v-model="form.rate"></star>
                <b-button variant="success" disabled @click="sumbitRate" v-if="!isLoading">ให้คะแนน</b-button>
              </b-card>
            </b-tab>
            <b-tab title="ประวัติการสร้างโครงการ">
              <b-table :items="projects" :fields="fieldsTabel"></b-table>
            </b-tab>
            <b-tab title="ตรวจสอบความเคลื่อนไหว"></b-tab>
          </b-tabs>
        </div>

        <!-- infomation -->
        <div class="col-sm-4">
          <b-card header="Profile">
            <div class="panel-body">
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group">
                    <label class="bold">Place of Birth:</label>
                    <p>pune, maharashtra</p>
                  </div>
                  <div class="form-group">
                    <label class="bold">Date of Birth:</label>
                    <p>26 Sep 2017</p>
                  </div>
                  <div class="form-group">
                    <label class="bold">Time of Birth:</label>
                    <p>11:20 min.</p>
                  </div>
                  <div class="form-group">
                    <label class="bold">Horroscoe Match not Necessory</label>
                  </div>
                  <div class="form-group">
                    <label class="bold">Sun Sign:</label>
                    <p>Scorpio</p>
                  </div>
                  <div class="form-group">
                    <label class="bold">Rashi/ Moon sign:</label>
                    <p>Mesh</p>
                  </div>
                  <div class="form-group">
                    <label class="bold">Nakshtra:</label>
                    <p>Bharani</p>
                  </div>
                  <div class="form-group">
                    <label class="bold">Manglik:</label>
                    <p>Manglik</p>
                  </div>
                  <!-- <button type="button" class="btn btn-dark">Edit</button> -->
                </div>
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "../service";
import star from "vue-star-rating";
import { mapGetters } from "vuex";
import moment from 'moment';
export default {
  components: {
    star
  },
  props: {
    id: null
  },
  data() {
    return {
      owner: {},
      rating: {},
      projects: [],
      ownerInfo: {},
      form: {
        rate: null
      },
      isLoading: false,
      fieldsTabel: [
        {key: "title", label: "ชื่อโครงการ"},
        {key: "status", label: "สถานะโครงการ"},
        {key: "endtime", label: "วันสิ้นสุด", formatter: this.timeFormatter},
      ]
    };
  },
  created() {
    this.getAllData();
  },
  computed: {
    ...mapGetters(["getUser"])
  },
  methods: {
    async getAllData() {
      this.owner;
      this.ownerInfo = await service.getUserInfo(this.id);
      this.rating = await service.getCreatorRating(this.id);
      this.projects = await service.getMyProject(this.id);
    },
    async sumbitRate() {
      try {
        this.isLoading = true;
        const rater = this.getUser.uid;
        await service.sendRating(this.id, rater, this.form.rate);
        this.rating = await service.getCreatorRating(this.id);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    timeFormatter(value, key, item) {
      return moment(value).format('LL');
    }
  }
};
</script>

<style scoped>
.fb-profile img.fb-image-lg {
  z-index: 0;
  width: 100%;
  margin-bottom: 10px;
}

.fb-image-profile {
  margin: -90px 10px 20px 80px;
  z-index: 9;
  width: 12rem;
}

@media (max-width: 768px) {
  .fb-profile-text > h1 {
    font-weight: 700;
    font-size: 16px;
  }

  .fb-image-profile {
    margin: -45px 10px 0px 25px;
    z-index: 9;
    width: 20%;
  }
}

.heading {
  font-size: 25px;
  margin-right: 25px;
}

.menu_title {
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
  margin: 0 5px;
}

.bold {
  font-weight: bold;
}
</style>