<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col">
        <h1>ขอถอนเงิน</h1>
        <p>ชื่อโครงการ: {{project.title}}</p>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col">
        <p>ยอดเงินปัจจุบัน: {{ project.balance | currency }}</p>
        <b-alert show variant="warning">สามารถถอนเงินได้ xxxxx</b-alert>
        <hr />
        <div class="row">
          <div class="col">
            <b-form @submit="onSubmit">
              <b-form-group
                id="input-group-1"
                label="จำนวนเงิน:"
                description="คุณสามารถถอนได้ไม่เกิน xxxxxx"
              >
                <b-form-input
                  id="input-1"
                  v-model="form.amount"
                  type="number"
                  required
                  placeholder="ex. 40000"
                ></b-form-input>
              </b-form-group>

              <b-button type="submit" variant="primary" :disabled="!canWithdraw">Submit</b-button>
            </b-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import service from "../service/";
export default {
  props: {
    id: null
  },
  data() {
    return {
      project: {},
      user: {},
      form: {
        amount: null
      }
    };
  },
  created() {
    this.getAllData();
  },
  computed: {
    ...mapGetters(["getUser"]),
    canWithdraw() {
        if(this.form.amount) {
            return true;
        } else {
            return false;
        }
    }
  },
  methods: {
    async getAllData() {
      this.project = await service.getProjectByID(this.id);
      this.user = await this.getUser;
    },
    async onSubmit() {
        
    }
  }
};
</script>
