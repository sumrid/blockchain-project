<template>
  <div class="container box">
    <div class="row">
      <div class="col">
        <p>
          <b>โครงการ:</b>
          {{project.title}}
        </p>
        <p>เป้าหมาย: {{project.goal | currency}}</p>
        <p>ยอดสะสม: {{project.accumulated | currency}}</p>
        <p>สถานะ: {{project.status}}</p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <b-button-group>
          <router-link :to="{ name: 'project', params: { id: id }}" target="_blank">
            <b-btn variant="info" id="btn-info">รายละเอียด</b-btn>
          </router-link>
          <router-link :to="{ name: 'sendInvoice', params: { id: id }}">
            <b-btn variant="light" id="btn-invoice">เพิ่มใบกำกับภาษี</b-btn>
          </router-link>
          <div id="btn-withdraw">
            <router-link :to="{ name: 'withdraw', params: {id:id}}">
              <b-btn variant="light" id="btn-withdraw">ขอเงินจากโครงการ</b-btn>
            </router-link>
          </div>
          <router-link :to="{ name: 'editProject', params: { id: id }}">
            <b-btn variant="warning">แก้ไขข้อมูล</b-btn>
          </router-link>

          <b-tooltip target="btn-invoice" triggers="hover">นำใบกำกับภาษีมายืนยัน</b-tooltip>
          <b-tooltip
            target="btn-withdraw"
            triggers="hover"
          >ขอเงินจากโครงการออกไปใช้ก่อน แล้วจึงนำใบกำกับภาษีมาเป็นหลักฐาน</b-tooltip>
        </b-button-group>
      </div>
    </div>
  </div>
</template>

<script>
import service from "../service";
export default {
  props: {
    id: String
  },
  data() {
    return {
      project: {}
    };
  },
  async created() {
    this.project = await service.getProjectByID(this.id);
  }
};
</script>

<style scoped>
.box {
  background-color: rgb(225, 244, 255);
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
</style>