<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <h1 class="text-center">ติดต่อเรา</h1>
        </div>
      </div>
      <div class="row">
        <div class="col text-center">
          <iframe
            width="500rem"
            height="500rem"
            id="gmap_canvas"
            src="https://maps.google.com/maps?q=empire%20tower&t=&z=17&ie=UTF8&iwloc=&output=embed"
            frameborder="0"
            scrolling="yes"
            marginheight="10rem"
            marginwidth="10rem"
          ></iframe>
        </div>
        <div class="col">
          <b-form @submit.prevent>
            <b-form-group>
              <label class="col-md-4 control-label">ชื่อ</label>
              <div class="col-md-4 inputGroupContainer">
                <b-input-group>
                  <template v-slot:prepend>
                    <span class="input-group-addon">
                      <icon :icon="icon.send" />
                    </span>
                  </template>
                  <b-form-input name="first_name" placeholder="กรอกชื่อ" type="text" />
                </b-input-group>
              </div>
            </b-form-group>

            <b-form-group>
              <label class="col-md-4 control-label">นามสกุล</label>
              <div class="col-md-4 inputGroupContainer">
                <div class="input-group">
                  <span class="input-group-addon">
                    <i class="glyphicon glyphicon-user"></i>
                  </span>
                  <b-form-input
                    name="last_name"
                    placeholder="กรอกนามสกุล"
                    class="form-control"
                    type="text"
                  />
                </div>
              </div>
            </b-form-group>

            <!-- Text input-->
            <div class="form-group">
              <label class="col-md-4 control-label">อีเมลล์</label>
              <div class="col-md-4">
                <b-input-group prepend="@">
                  <b-form-input
                    name="email"
                    placeholder="กรอกอีเมลล์"
                    class="form-control"
                    type="text"
                  />
                </b-input-group>
              </div>
            </div>

            <div class="form-group">
              <label class="col-md-4 control-label">เบอร์โทรศัพท์</label>
              <div class="col-md-4 inputGroupContainer">
                <div class="input-group">
                  <span class="input-group-addon">
                    <i class="glyphicon glyphicon-earphone"></i>
                  </span>
                  <input name="phone" placeholder="+66xx xxx xxxx" class="form-control" type="text" />
                </div>
              </div>
            </div>
            <br />

            <!-- Select Basic -->

            <div class="form-group">
              <label class="col-md-4 control-label">หัวข้อที่ต้องการติดต่อ</label>
              <div class="col-md-4 selectContainer">
                <div class="input-group">
                  <span class="input-group-addon">
                    <i class="glyphicon glyphicon-list"></i>
                  </span>
                  <select name="state" class="form-control selectpicker">
                    <option value=" ">โปรดเลือกหัวข้อ</option>
                    <option>การสร้างโครงการ</option>
                    <option>เงื่อนไขการบริจาค</option>
                    <option>ช่องทางการบริจาค</option>
                    <option>การรับเงินจากโครงการ</option>
                    <option>การตรวจสอบโครงการ</option>
                    <option>การขอรายละเอียดโครงการเพื่มเติม</option>
                    <option>แจ้งโครงการที่ไม่โปร่งใส</option>
                    <option>ข้อเสนอแนะ</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Text area -->

            <div class="form-group">
              <label class="col-md-4 control-label">รายละเอียด</label>
              <div class="col-md-4 inputGroupContainer">
                <div class="input-group">
                  <span class="input-group-addon">
                    <i class="glyphicon glyphicon-pencil"></i>
                  </span>
                  <textarea class="form-control" name="comment" placeholder="Project Description"></textarea>
                </div>
              </div>
            </div>

            <!-- Button -->
            <div class="form-group">
              <label class="col-md-4 control-label"></label>
              <div class="col-md-4">
                <button type="submit" class="btn btn-warning">
                  <icon :icon="icon.send" />ส่ง
                </button>
              </div>
            </div>
          </b-form>
        </div>
      </div>
    </div>
    <my-footer />
  </div>
</template>

<script>
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import myFooter from "../components/Footer";
export default {
  components: {
    myFooter
  },
  data() {
    return {
      icon: {
        send: faPaperPlane
      }
    };
  }
};
</script>