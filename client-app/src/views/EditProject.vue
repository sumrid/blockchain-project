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
            <label>จำนวนเงินที่ต้องการ</label>
            <input
              class="form-control"
              placeholder="จำนวน"
              required
              type="number"
              v-model="form.goal"
            />
          </div>
          
          <b-form-group label="ผู้ที่ทำการรับเงินจากโครงการนี้">
            <b-form-input
              class="form-control"
              v-model="form.receiver"
              disabled
              placeholder="กรุณาใส่ id หรือ email ของผู้รับ"
              trim
              type="email"
            ></b-form-input>
            
          </b-form-group>
          
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
            <label for="date">วันสิ้นสุดโครงการ</label>
            <datepicker :required="isRequired" v-model="form.endtime" :language="th" disabled>
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
import { th } from "vuejs-datepicker/dist/locale";
import service from "../service";
import moment from "moment";
import { DATE_LAYOUT } from "../util";
import { mapGetters, mapState } from "vuex";
import auth from "../firebase";
import { storage } from "firebase";

export default {
  components: {
    Datepicker,
    VueTagsInput,
    VueEditor
  },
  data() {
    return {
      form: {},
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
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    ...mapState(["user"])
  },
  created() {
    const id = this.$route.params.id;
    this.getProject(id);
  },
  methods: {
    getProject: async function(id) {
      this.form = await service.getProjectByID(id);
    },
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
      //   this.isLoading = true;
      //   try {
      //     this.form.endtime = moment(this.form.date).format(DATE_LAYOUT);
      //     const res = await service.createProject(this.form);
      //     this.res = res;
      //     this.isLoading = false;
      //   } catch (err) {
      //     this.error = err;
      //     this.isLoading = false;
      //   }
    },
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