<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <div class="fb-profile">
            <!-- background picture -->
            <img align="left" class="fb-image-lg" src="@/assets/cover.jpg"
              alt="Profile image example" />
            <!-- profile picture -->
            <img align="left" class="fb-image-profile thumbnail"
              src="data:image/png;base64,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"
              alt="Profile image example" />
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
              <hr>
              <b-card title="ให้คะแนน" v-if="getUser">
                <star :star-size="20" v-model="form.rate"></star>
                <p v-if="form.rate">คุณเลือก {{form.rate}} คะแนน</p>
                <b-button variant="success" :disabled="!form.rate" @click="sumbitRate" v-if="!isLoading">ให้คะแนน
                </b-button>
                <b-button variant="success" disabled v-else>
                  <b-spinner small type="grow" label="Loading..."></b-spinner> กำลังให้คะแนน
                </b-button>
              </b-card>
              <b-card title="ให้คะแนน" v-else>
                <b-alert show variant="warning">กรุณาเข้าสู่ระบบเพื่อทำการให้คะแนน</b-alert>
                <star :star-size="20" v-model="form.rate"></star>
                <b-button variant="success" disabled @click="sumbitRate" v-if="!isLoading">ให้คะแนน
                </b-button>
              </b-card>
            </b-tab>
            <b-tab title="ประวัติการสร้างโครงการ"></b-tab>
            <b-tab title="ตรวจสอบความเคลื่อนไหว"></b-tab>
          </b-tabs>
        </div>
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
  import { mapGetters } from 'vuex';
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
        ownerInfo: {},
        rating: {},
        form: {
          rate: null
        },
        isLoading: false
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
    .fb-profile-text>h1 {
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