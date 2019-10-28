<template>
  <div>
    <div class="container">
        <div class="row">
            <div class="col text-center"><h3>คนสร้างโครงการ</h3></div>
        </div>
    </div>
    <my-footer />
  </div>
</template>

<script>
import myFooter from "@/components/Footer";
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
  created() {
      document.title = "ลงทะเบียนผู้สร้างโครงการ";
  },
};
</script>