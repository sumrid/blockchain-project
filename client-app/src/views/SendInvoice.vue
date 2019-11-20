<template>
  <div class="container">
    <div class="row">
      <div class="col text-center m-4">
        <h1>ส่งใบกำกับภาษี</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <p>ชื่อโครงการ: {{project.title}}</p>
        <b-form-group label="รหัสโครงการ">
          <b-form-input id="input-horizontal" v-model="project.id" disabled></b-form-input>
        </b-form-group>

        <b-form-group label="กรอกรหัสใบกำกับภาษี">
          <b-input v-model="invID"></b-input>
        </b-form-group>
        <b-btn disabled v-if="isLoadingInvoice"><b-spinner></b-spinner> Checking</b-btn>
        <b-btn @click="getInvoice" :disabled="!invID" v-else>Check</b-btn>
        <hr />
        <pre>{{inv}}</pre>
        <hr />

        <template v-if="showAlert">
          <b-alert
            variant="danger"
            show
          >เงินของโครงการมีไม่พอ (โครงการมีเงิน {{project.balance}} แต่ใบกำกับภาษีต้องจ่าย {{inv.total | currency}})</b-alert>
        </template>
        <template v-else>
          <b-btn @click="sendInvoice" :disabled="!canSend" v-if="!isLoading">ส่งใบกำกับภาษี</b-btn>
          <b-btn disabled v-else>
            <b-spinner></b-spinner>กำลังส่งใบกำกับภาษี
          </b-btn>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import service from "../service";
import { fas, faSlash } from "@fortawesome/free-solid-svg-icons";
export default {
  data() {
    return {
      showAlert: false,
      isLoading: false,
      isLoadingInvoice: false,
      project: null,
      invID: null,
      user: null,
      inv: null
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    canSend() {
      if (this.project && this.user && this.inv) return true;
      else false;
    }
  },
  methods: {
    checkBalance: function() {
      if (this.project.balance < this.inv.total) {
        this.showAlert = true;
      } else {
        this.showAlert = false;
      }
    },
    getProject: async function(id) {
      this.project = await service.getProjectByID(id);

      // check owner
      if (this.project.owner != this.getUser.uid) {
        console.info(`[info] not owner for this project`);
        this.$router.replace({ name: "project", params: { id } });
      }
    },
    getInvoice: async function() {
      try {
        this.isLoadingInvoice = true;
        this.inv = await service.getInvoiceByID(this.invID);
        this.checkBalance();
        this.isLoadingInvoice = false;
      } catch (error) {
        this.showAlert = false;
        this.inv = null;
        this.isLoadingInvoice = false;
        alert(error);
      }
    },
    sendInvoice: async function() {
      try {
        this.isLoading = true;
        this.user = this.getUser.uid;
        console.log(
          `send invoice wiht ${this.user}, ${this.project}, ${this.inv.total}`
        );
        let res = await service.sendInvoice(
          this.user,
          this.project.id,
          this.inv
        );
        this.isLoading = false;
        this.invID = null;
        this.inv = null;
      } catch (error) {
        this.isLoading = false;
        alert(error);
      }
    }
  },
  created() {
    let projectID = this.$route.params.id;
    this.user = this.getUser.uid;
    this.getProject(projectID);
  }
};
</script>