<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col">
          <h2>ยืนยันตัวตน</h2>

          <hr />

          <h4>E-mail</h4>
          <b-alert variant="success" v-if="user.emailVerified" show>ยืนยัน E-mail เรียบร้อยแล้ว</b-alert>
          <template v-else>
            <b-alert show variant="danger">กรุณายืนยัน E-mail {{user.email}}</b-alert>
            <b-button variant="outline-primary" @click="sendEmail" v-if="!isSent">Resend e-mail</b-button>
            <b-button variant="outline-primary"  v-else disabled>ส่ง email แล้ว</b-button>
          </template>

          <hr />

          <h4>บัตรประชาชน</h4>
          <template v-if="userInfo.id_card_img">
            <b-alert variant="success" show v-if="userInfo.verifyIDCard">
              ยืนยันบัตรแล้ว
              <br />
              รหัสธุรกรรม: {{userInfo.verifyID_tx}}
            </b-alert>
            <b-alert variant="warning" show v-else>รอการยืนยัน</b-alert>
            <!-- ID card image -->
            <div class="row">
              <div class="col">
                <b-img class="idcard" :src="userInfo.id_card_img" rounded fluid></b-img>
              </div>
            </div>
          </template>

          <template v-else>
            <!-- ID card image -->
            <div class="row" v-if="form.id_card_img">
              <div class="col">
                <b-img class="idcard" :src="form.id_card_img" rounded fluid></b-img>
              </div>
            </div>

            <b-form @submit.prevent="submitIDCard">
              <!-- input file -->
              <b-form-group label="รูปบัตรประชาชน" label-for="file-default" label-cols-sm="2">
                <b-form-file
                  v-model="file"
                  label-cols-sm="5"
                  :state="Boolean(file)"
                  placeholder="รูปบัตรประชาชน"
                  drop-placeholder="Drop file here..."
                  accept="image/jpeg, image/png, image/gif"
                  @input="uploadImage()"
                ></b-form-file>
                <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
              </b-form-group>

              <!-- loading -->
              <div class="row" v-if="isUploading">
                <div class="col">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="false"></span>
                  กำลังอัปโหลดรูผปภาพ
                </div>
              </div>

              <div class="row" v-if="!isLoadingCardSubmit">
                <b-col cols="4" align-self="end">
                  <b-btn type="submit">ส่งข้อมูล</b-btn>
                </b-col>
              </div>
              <div class="row" v-else>
                <b-col cols="4" align-self="end">
                  <b-btn disabled>
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="false"
                    ></span>
                    ส่งข้อมูล
                  </b-btn>
                </b-col>
              </div>
            </b-form>
          </template>
          {{userInfo}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { storage } from "firebase";
import service from "../../service";

export default {
  data() {
    return {
      form: {},
      user: {},
      userInfo: {},
      file: null,
      isUploading: false,
      isLoadingCardSubmit: false,
      isSent: false
    };
  },
  computed: {
    ...mapGetters(["getUser"])
  },
  async created() {
    this.user = this.getUser;
    this.userInfo = await service.getUserInfo(this.user.uid);
  },
  methods: {
    async uploadImage() {
      try {
        console.info("[verify] [upload image]");
        this.isUploading = true;
        const imageType = this.file.name.split(".").pop();
        const ref = storage().ref(`users/${this.user.uid}/IDCard.${imageType}`);
        await ref.put(this.file);
        const url = await ref.getDownloadURL();
        this.form.id_card_img = url;
        this.isUploading = false;
      } catch (error) {
        console.error(error);
        this.isUploading = false;
      }
    },
    async loadUserInfo() {
      this.userInfo = await service.getUserInfo(this.user.uid);
    },
    async submitIDCard() {
      try {
        this.isLoadingCardSubmit = true;
        console.info(`[verify] [submit id card]`);
        const body = {
          id_card_img: this.form.id_card_img,
          verifyIDCard: false
        };
        await service.updateUser(this.user.uid, body);
        this.isLoadingCardSubmit = false;
        this.loadUserInfo();
      } catch (error) {
        console.error(error);
        this.isLoadingCardSubmit = false;
      }
    },
    async sendEmail() {
      try {
        await service.sendConfirmEmail(this.user.email);
        this.isSent = true;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.idcard {
  width: 30rem;
  margin: 1rem;
}
</style>