<template>
  <div class="container box">
    <div class="row">
      <div class="col">
        <p>โครงการ: {{project.title}}</p>
        <p>ยอดสะสม: {{project.accumulated | currency}}</p>
        <p>สถานะ: {{project.status}}</p>
      </div>
    </div>
    <div class="row">
        <div class="col">
            <b-btn>รายละเอียด</b-btn>
            <b-btn>ขอเงินจากโครงการ</b-btn>
            <b-btn>เพิ่มใบกำกับภาษี</b-btn>
        </div>
    </div>
    <div class="row">
        <div class="col">
            {{project}}
        </div>
    </div>
  </div>
</template>

<script>
import service from '../service'
export default {
  props: {
    id: String
  },
  data() {
      return {
          project: null
      }
  },
  async created() {
      this.project = await service.getProjectByID(this.id);
  },
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