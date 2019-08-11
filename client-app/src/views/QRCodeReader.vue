<template>
  <div>
    <p class="error">{{ error }}</p>

    <p class="decode-result">
      Last result:
      <b>{{ result }}</b>
    </p>

    <qrcode-stream @decode="onDecode" @init="onInit" />
    <qrcode-capture @decode="onDecode" />
  </div>
</template>

<script>
import { QrcodeStream, QrcodeCapture } from "vue-qrcode-reader";
const util = require("../util");
const axios = require("axios");

export default {
  components: { QrcodeStream, QrcodeCapture },
  data() {
    return {
      result: "",
      error: ""
    };
  },
  methods: {
    async onDecode(result) {
      this.result = result;
      const body = JSON.parse(result);
      const URL = `http://${util.API_IP}:8000/api/project/donate/readqr`;
      await axios.default.post(URL, body);
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        console.log(error);
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    }
  }
};
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
</style>