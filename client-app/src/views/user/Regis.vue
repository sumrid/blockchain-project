<template>
  <div>
    <div class="container">
      <div class="row m-4">
        <div class="col text-center">
          <h3>เลือกประเภทที่ต้องการสมัครสมาชิก</h3>
        </div>
      </div>
      <div class="row m-3">
        <b-card-group deck>
          <b-card img-src="http://placehold.it/600x500">
            <b-button block to="/regis/user" variant="warning">ผู้บริจาคทั่วไป</b-button>
          </b-card>
          <b-card img-src="http://placehold.it/600x500">
            <b-button block to="/regis/creator" variant="warning">ผู้ดูแลโครงการ</b-button>
          </b-card>
        </b-card-group>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
import myFooter from "@/components/Footer";
export default {
  components: {
    myFooter
  },
  created() {
    document.title = "Donate-web | เลือกลงทะเบียน";
  }
};
</script>