<template>
  <div class="container block text-center">
    <div class="row">
      <div class="col">
        <h1>ยืนยันการรับเงินจากโครงการนี้</h1>
        <p>การที่เป็นผู้รับเงินของโครงการนี้ จะมีสิทธ์ในการขอเงินออกไปใช้</p>
      </div>
    </div>
    <div class="row">
      <div class="col code">
        <code>Lorem ipsum dolor sit amet, tristique a, parturient nunc donec at, nec parturient amet sit in dictum. Turpis ut eget, viverra etiam eget netus, a dictum non enim vehicula nonummy, donec mattis in lectus. Venenatis nemo elit nec, euismod quis quisque leo, non vestibulum ante eget, quis quis a turpis massa accumsan ipsum, ultricies cursus dictum fermentum a suspendisse. Sapien conubia fringilla ut vestibulum nonummy, pretium fringilla egestas. Eget nec amet fringilla integer donec phasellus, quam sed, suspendisse pellentesque scelerisque libero, vehicula sociosqu feugiat eleifend mollis nibh velit, rutrum eget nisl.</code>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <b-form-checkbox id="checkbox-1" v-model="accept">I accept the terms and use</b-form-checkbox>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <b-button variant="success" :disabled="!accept" @click="onAccept">ยืนยัน</b-button>
        <!-- <span>....</span>
        <b-button variant="danger">ไม่ยอมรับ</b-button>-->
      </div>
    </div>
    <div class="row">
      <div class="col">{{req}}</div>
    </div>
  </div>
</template>

<script>
import auth from "../../firebase";
import service from "../../service";
export default {
  data() {
    return {
      accept: false,
      req: {
        user: "",
        project: "",
        status: "open"
      },
      isLoading: false
    };
  },
  created() {
    this.req.project = this.$route.params.id;
    this.req.user = auth.currentUser.uid;
  },
  methods: {
    onAccept: async function() {
      try {
        this.isLoading = true;
        await service.updateProjectStatus(
          this.req.user,
          this.req.project,
          this.req.status
        );
        this.$router.go(-1);
      } catch (error) {
          alert(error.message);
      }
    }
  }
};
</script>

<style>
.block {
  background-color: antiquewhite;
  margin: 5rem;
  padding: 2rem;
  border-radius: 0.7rem;
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.4);
}
.code {
  padding: 0.5rem;
  margin: 0.5rem;
}
b-button + b-button {
  margin: 1rem;
}
</style>