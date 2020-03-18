<template>
  <div class="container">
    <div class="row">
      <div class="col m-4">
        <H1 class="text-center">แก้ไขโครงการ</H1>
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

          <!-- รูปภาพหลัก -->
          <div class="form-group">
            <label>รูปหลัก</label>
            <b-form-file
              v-model="mainImage"
              :state="Boolean(mainImage)"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
              accept="image/jpeg, image/png, image/gif"
            ></b-form-file>
          </div>
          <b-row align-content="center" v-if="isMainImageUpload">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="false"></span> Uploading...
          </b-row>
          <b-row align-content="center" align-h="center">
            <b-col>
              <b-img :src="form.image" fluid rounded width="500"></b-img>
            </b-col>
          </b-row>
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

          <!--
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
          -->

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

          <!-- Button -->
          <b-button v-if="isLoading" class="btn btn-primary" disabled block variant="info">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="false"></span> Updating...
          </b-button>
          <b-button v-else type="submit" class="btn btn-primary" block variant="info">Submit</b-button>
        </form>
      </div>
    </div>
    <b-toast id="success-toast" title="อัพเดตสำเร็จ" variant="success">ทำการแก้ไขข้อมูลเรียบร้อยแล้ว</b-toast>
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
      mainImage: null,
      isMainImageUpload: false,
      tag: "",
      error: "",
      res: "",
      th: th
    };
  },
  watch: {
    mainImage() {
      this.uploadMainImage();
    }
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
      this.form = await service.getProjectInfo(id); // firebase
      const block = await service.getProjectByID(id); // block

      // check owner
      if (block.owner != this.getUser.uid) {
        console.info(`[info] not owner for this project`);
        this.$router.replace({ name: "project", params: { id } });
      }
      console.info(`[info] [get project]`);
    },
    async uploadMainImage() {
      console.info(`[info] upload image`);
      // Upload main image
      try {
        this.isMainImageUpload = true;
        const type = this.mainImage.name.split(".").pop(); // สกุลไฟล์
        const imgName = `main.${type}`;
        const ref = storage().ref(`project/${this.form.id}/${imgName}`);
        await ref.put(this.mainImage);
        const url = await ref.getDownloadURL();
        this.form.image = url;
        this.isMainImageUpload = false;
        console.info(`[info] upload image success`);
      } catch (err) {
        console.error(err);
        console.error(`[error] upload image fail.`);
        this.isMainImageUpload = false;
      }
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
      console.info(`[info] submit data.`);
      this.isLoading = true;
      try {
        const res = await service.updateProject(this.form);
        this.res = res;
        this.isLoading = false;
        this.$bvToast.show("success-toast");
        console.info(`[info] submit success.`);
      } catch (err) {
        this.error = err;
        this.isLoading = false;
        console.error(`[error] submit fail.`);
      }
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {});
  }
};
</script>

<style scoped>
.textleft {
  text-align: left;
}
</style>