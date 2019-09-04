<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <H1 class="text-center">เพิ่มโครงการ</H1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <form @submit.prevent="onSubmit" class="textleft">
          <div class="form-group">
            <label>ชื่อโครงการ</label>
            <input
              class="form-control"
              placeholder="ใส่ชื่อโครงการ!!"
              required
              v-model="form.title"
            />
          </div>
          <div class="form-group">
            <label for="exampleFormControlFile1">รูปหลัก</label>
            <b-form-file
              v-model="file"
              :state="Boolean(file)"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
              accept="image/jpeg, image/png, image/gif"
            ></b-form-file>
          </div>
          <div class="form-group">
            <label>จำนวนเงินที่ต้องการ <strong>{{form.goal | currency}}</strong></label>
            <input
              class="form-control"
              placeholder="จำนวน"
              required
              v-model="form.goal"
            />
            <!-- <currency-input :value="form.goal"/> -->
          </div>
          <!-- <div class="form-group"> -->
          <b-form-group label="ผู้ที่ทำการรับเงินจากโครงการนี้">
            <b-form-input
              class="form-control"
              v-model="receiverInput"
              :state="Boolean(this.isReceiver)"
              placeholder="กรุณาใส่ id หรือ email ของผู้รับ"
              trim
              type="email"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!isReceiver">ไม่มีผู้ใช้นี้</b-form-invalid-feedback>
          </b-form-group>
          <!-- </div> -->
          <div class="form-group">
            <label>รายละเอียด</label>
            <vue-editor useCustomImageHandler @image-added="uploadImage" v-model="form.detail"></vue-editor>
            <p v-if="isUploading">
              Uploading...
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="false"
              ></span>
            </p>
          </div>
          <div class="form-group">
            <label for="date">เลือกวันสิ้นสุดโครงการ</label>
            <datepicker :required="isRequired" v-model="form.date" :language="th">
              <div slot="beforeCalendarHeader" class="calender-header">Choose a Date</div>
            </datepicker>
          </div>
          <div class="form-group">
            <label for="tags">Tags</label>
            <vue-tags-input
              v-model="tag"
              :tags="form.tags"
              @tags-changed="newTags => form.tags = newTags"
            />
          </div>
          <button type="submit" class="btn btn-primary">
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="false"
            ></span>Submit
          </button>
        </form>
      </div>
    </div>
    <p>{{form}}</p>
    <p v-if="error">Error: {{error}}</p>
    <p v-if="res">ผลลัพธ์: {{res}}</p>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { VueEditor } from "vue2-editor";
import VueTagsInput from "@johmun/vue-tags-input";
import {CurrencyInput} from 'vue-currency-input'
import { th } from "vuejs-datepicker/dist/locale";
import service from "../service";
import moment, { version } from "moment";
import { DATE_LAYOUT } from "../util";
import { mapGetters, mapState } from "vuex";
import auth from "../firebase";
import { storage } from "firebase";

export default {
  components: {
    Datepicker,
    VueTagsInput,
    VueEditor,
    CurrencyInput
  },
  data() {
    return {
      form: {
        tags: [],
        title: "",
        detail: "",
        owner: "",
        goal: null,
        receiver: "",
        date: ""
      },
      goalInput: 0,
      receiverInput: "",
      file: null,
      isLoading: false,
      isUploading: false,
      isRequired: true,
      isReceiver: false,
      tag: "",
      error: "",
      res: "",
      th: th,
      timeoutNum: ""
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    ...mapState(["user"])
  },
  watch: {
    receiverInput: function() {
      clearTimeout(this.timeoutNum);
      this.timeoutNum = setTimeout(this.receiverValid, 500);
    },
  },
  methods: {
    uploadImage: async function(file, Editor, cursorLocation, resetUploader) {
      try {
        this.isUploading = true;
        let ref = storage().ref(`project/images/${file.name}`);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        Editor.insertEmbed(cursorLocation, "image", url); // set images
        resetUploader();
        this.isUploading = false;
      } catch (err) {
        this.error = err;
        this.isUploading = false;
      }
    },
    onSubmit: async function() {
      this.isLoading = true;
      try {
        this.form.endtime = moment(this.form.date).format(DATE_LAYOUT);
        const res = await service.createProject(this.form);
        this.res = res;
        this.isLoading = false;
      } catch (err) {
        this.error = err;
        this.isLoading = false;
      }
    },
    receiverValid: async function() {
      try {
        this.form.receiver = await service.checkUserExists(this.receiverInput);
        this.isReceiver = true;
      } catch (error) {
        this.isReceiver = false;
        this.form.receiver = "";
      }
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.form.owner = user.uid;
      } else {
        this.form.owner = "";
      }
    });
  }
};
</script>

<style scoped>
.textleft {
  text-align: left;
}
</style>