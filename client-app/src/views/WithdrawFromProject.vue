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
            <b-form @submit.prevent="onSubmit">
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
                  :state="inputState"
                ></b-form-input>
              </b-form-group>

              <b-button variant="primary" disabled v-if="isLoading"><b-spinner small></b-spinner> Submit...</b-button>
              <b-button type="submit" variant="primary" :disabled="!canWithdraw" v-else>Submit</b-button>
            </b-form>
          </div>
        </div>
      </div>
    </div>
    
    <hr />
    <div class="row">
      <div class="col">
        <h4>ประวัติการถอนเงิน</h4>
        <withdraw-list :items="withdraws"></withdraw-list>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import service from "../service/";
import WithdrawList from '@/components/withdraw/WithdrawItemList';

export default {
  props: {
    id: null
  },
  components: {
    WithdrawList
  },
  data() {
    return {
      project: {},
      user: {},
      form: {
        amount: null
      },
      withdraws: [],
      isLoading: false
    };
  },
  created() {
    this.getAllData();
  },
  computed: {
    ...mapGetters(["getUser"]),
    canWithdraw() {
      if (this.form.amount) {
        if (this.form.amount > this.project.balance) return false;
        else return true;
      } else {
        return false;
      }
    },
    inputState() {
      if (this.form.amount) {
        if (this.form.amount > this.project.balance) return false;
        else return null;
      } else return null;
    }
  },
  methods: {
    async getAllData() {
      this.project = await service.getProjectByID(this.id);
      this.user = await this.getUser;
      this.withdraws = await service.getProjectWithdraw(this.id);
    },
    async onSubmit() {
      try {
        this.isLoading = true;
        const user = this.user.uid;
        const project = this.id;
        const amount = this.form.amount;
        await service.projectWithdraw(user, project, amount);
        this.getAllData();
        this.form.amount = null;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    }
  }
};
</script>
