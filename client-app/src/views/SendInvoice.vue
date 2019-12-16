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
        <p>ยอดเงินปัจจุบัน: {{project.balance | currency}}</p>
        <b-form-group label="รหัสโครงการ">
          <b-form-input id="input-horizontal" v-model="project.id" disabled></b-form-input>
        </b-form-group>

        <b-form-group label="กรอกรหัสใบกำกับภาษี">
          <b-input v-model="invID"></b-input>
        </b-form-group>
        <b-btn disabled v-if="isLoadingInvoice">
          <b-spinner small></b-spinner>&nbsp;Checking
        </b-btn>
        <b-btn @click="getInvoice" :disabled="!invID" v-else>Check</b-btn>
        <hr />

        <!-- แสดง invoice -->
        <template v-if="inv">
          <pre>{{inv}}</pre>
          <div id="invoice" class="invoice-box">
            <table cellpadding="0" cellspacing="0">
              <tr class="heading">
                <td>สินค้า</td>
                <td>จำนวน</td>
                <td>ราคา/หน่วย</td>
              </tr>

              <tr class="item" v-for="(item, index) in inv.items" :key="index">
                <td>{{item.name}}</td>
                <td>{{item.amount}}</td>
                <td>{{item.price}}</td>
              </tr>

              <tr class="total">
                <td></td>
                <td></td>
                <td>{{inv.total | currency}}</td>
              </tr>
            </table>
          </div>
          <hr />
        </template>

        <!-- แจ้งเตือน -->
        <template v-if="showAlert">
          <b-alert
            variant="danger"
            show
          >เงินของโครงการมีไม่พอ (โครงการมีเงิน {{project.balance | currency}} แต่ใบกำกับภาษีต้องจ่าย {{inv.total | currency}})</b-alert>
        </template>

        <!-- ปุ่มส่ง -->
        <template v-else>
          <b-btn @click="sendInvoice" :disabled="!canSend" v-if="!isLoading">ส่งใบกำกับภาษี</b-btn>
          <b-btn disabled v-else>
            <b-spinner></b-spinner>&nbsp;กำลังส่งใบกำกับภาษี
          </b-btn>
        </template>
      </div>
    </div>

    <!-- Toast แจ้งเตือน -->
    <b-toast id="add-invoice-success" title="สำเร็จ" variant="success">เพิ่มใบกำกับภาษีสำเร็จแล้ว</b-toast>
    <b-toast
      id="error-toast"
      title="เกิดข้อผิดผลาด"
      variant="danger"
    >เกิดข้อผิดผลาด !! กรุณาลองใหม่อีกครั้ง</b-toast>
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
      project: {},
      invID: "",
      user: {},
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
          `[info] send invoice wiht ${this.user}, ${this.project}, ${this.inv.total}`
        );
        let res = await service.sendInvoice(
          this.user,
          this.project.id,
          this.inv
        );
        this.isLoading = false;
        this.invID = "";
        this.inv = null;
        this.showToast(1);
      } catch (error) {
        this.isLoading = false;
        alert(error);
      }
    },
    showToast(type) {
      if (type == 1) this.$bvToast.show("add-invoice-success");
      else this.$bvToast.show("error-toast");
    }
  },
  created() {
    let projectID = this.$route.params.id;
    this.user = this.getUser.uid;
    this.getProject(projectID);
  }
};
</script>

<style scoped>
.invoice-box {
  max-width: 800px;
  margin: auto;
  padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 24px;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  color: #555;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}
</style>