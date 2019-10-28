<template>
  <div>
    <div class="container">
      <div class="row m-4">
        <div class="col text-center">
          <h3>ลงทะเบียนใช้งาน</h3>
        </div>
      </div>
      <b-row align-h="center" class="p-4">
        <b-col lg="8">
          <b-form @submit.prevent="onSubmit">
            <b-form-group label-cols-sm="4" label-cols-lg="3" label-align="right" label="ชื่อจริง">
              <b-form-input required v-model="form.name"></b-form-input>
            </b-form-group>

            <b-form-group label-cols-sm="4" label-cols-lg="3" label-align="right" label="นามสกุล">
              <b-form-input required v-model="form.lastname"></b-form-input>
            </b-form-group>

            <b-form-group label-cols-sm="4" label-cols-lg="3" label-align="right" label="อีเมล">
              <b-form-input required type="email" v-model="form.email"></b-form-input>
            </b-form-group>

            <b-form-group label-cols-sm="4" label-cols-lg="3" label-align="right" label="รหัสผ่าน">
              <b-form-input required type="password" v-model="form.pass"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label-cols-lg="3"
              label-align="right"
              label="ยืนยันรหัสผ่าน"
            >
              <b-form-input required type="password" :state="isMatch" v-model="form.rePass"></b-form-input>
            </b-form-group>

            <b-button type="submit" block :disabled="!canRegis">ลงทะเบียน</b-button>
          </b-form>
        </b-col>
      </b-row>
    </div>
    <my-footer />
  </div>
</template>

<script>
import myFooter from "@/components/Footer";
import { PROTOCOL, API_IP } from "../../util.js";
import axios from "axios";
export default {
  components: {
    myFooter
  },
  data() {
    return {
      form: {
        name: "",
        lastname: "",
        email: "",
        pass: "",
        rePass: ""
      },
      isLoading: false
    };
  },
  computed: {
    isMatch() {
      if (this.form.pass && this.form.rePass) {
        return this.form.pass == this.form.rePass ? true : false;
      } else {
        return null;
      }
    },
    canRegis() {
        return this.isMatch;
    }
  },
  created() {
    document.title = "ลงทะเบียนผู้ใช้ทั่วไป";
  },
  methods: {
    async onSubmit() {
      const url = `${PROTOCOL}//${API_IP}:8000/api/user`;
      const form = this.form;
      try {
        const res = await axios.post(url, form);
        const body = {
            name: `${form.name} ${form.lastname}`,
            email: form.email
        }
        await axios.put(`${url}/${res.data.user.uid}`, body);
      } catch (error) {
          console.error(error);
      }
    }
  }
};
</script>