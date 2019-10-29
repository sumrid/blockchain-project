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

            <b-button block disabled v-if="isLoading">
              <b-spinner small type="grow"></b-spinner>กำลังลงทะเบียน
            </b-button>
            <b-button type="submit" block :disabled="!canRegis" v-else>ลงทะเบียน</b-button>
          </b-form>
        </b-col>
      </b-row>

      <!-- regis success modal -->
      <b-modal id="success-modal" title="ลงทะเบียนสำเร็จ" hide-footer="true" hide-header="true" @close="toHome" @hide="toHome">
        <p>กรุณากดยืนยันการลงทะเบียนใน E-mail ที่ใช้ลงทะเบียน</p>
        <b-button block @click="toHome">ตกลง</b-button>
      </b-modal>
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
      this.isLoading = true;
      const url = `${PROTOCOL}//${API_IP}:8000/api/user`;
      const form = this.form;
      try {
        // regis user
        const Regisbody = {
          name: `${form.name} ${form.lastname}`,
          email: form.email,
          password: form.pass,
          role: "donator"
        };
        const res = await axios.post(url, Regisbody);

        // add user data
        const userData = {
          name: `${form.name} ${form.lastname}`,
          email: form.email
        };
        await axios.put(`${url}/${res.data.user.uid}`, userData);

        this.form = {};
        this.isLoading = false;
        this.$bvModal.show("success-modal");
      } catch (error) {
        this.isLoading = false;
        console.error(error);
      }
    },
    toHome() {
      this.$router.replace("/");
    }
  }
};
</script>