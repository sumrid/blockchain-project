<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>แก้ไขโปรไฟล์</h1>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <b-form>
          <fieldset>
            <legend>Edit Profile</legend>

            <!-- Text input-->
            <div class="form-group">
              <label class="col-md-4 control-label" for="Name (Full name)">Name (Full name)</label>
              <div class="col-md-4">
                <div class="input-group">
                  <input
                    id="Name (Full name)"
                    name="Name (Full name)"
                    type="text"
                    placeholder="Name (Full name)"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </b-form>
      </div>
    </div>
    <my-footer />
  </div>
</template>

<script>
import myFooter from "../../components/Footer";
export default {
  components: {
    myFooter
  }
};
</script>