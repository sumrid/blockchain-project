<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <H1>เพิ่มโครงการ</H1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <form @submit.prevent="onSubmit" class="textleft">
          <div class="form-group">
            <label>ชื่อโครงการ</label>
            <b-form-input type="text" placeholder="ใส่ชื่อโครงการ!!" required v-model="form.title"></b-form-input>
          </div>
          <div class="form-group">
            <label for="exampleFormControlFile1">รูป</label>
            <b-form-file
              v-model="file"
              :state="Boolean(file)"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
              accept="image/jpeg, image/png, image/gif"
            ></b-form-file>
          </div>
          <div class="form-group">
            <label>จำนวนเงิน</label>
            <input class="form-control" placeholder="จำนวน" required type="number" v-model="form.goal" />
          </div>
          <div class="form-group">
            <label>รายละเอียด</label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="10"
              v-model="form.detail"
            ></textarea>
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
import VueTagsInput from "@johmun/vue-tags-input";
import { th } from "vuejs-datepicker/dist/locale";
import service from '../service';
import moment from "moment";
import { DATE_LAYOUT } from "../util";

export default {
  components: {
    Datepicker,
    VueTagsInput
  },
  data() {
    return {
      form: {
        tags: [],
        title: "",
        detail: "",
        owner: "user1",
        goal: null,
        receiver: "",
        date: ""
      },
      file: null,
      isLoading: false,
      isRequired: true,
      tag: "",
      error: "",
      res: "",
      th: th
    };
  },
  methods: {
    onSubmit: async function() {
      this.isLoading = true
      try {
        this.form.endtime = moment(this.form.date).format(DATE_LAYOUT);
        const res = await service.createProject(this.form);
        this.res = res;
        this.isLoading = false;
      } catch (err) {
        this.error = err;
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.textleft {
  text-align: left;
}
</style>