<template>
  <b-container>
    <b-row>
      <b-col>
        <div id="invoice" class="invoice-box">
          <table cellpadding="0" cellspacing="0">
            <tr class="top">
              <td colspan="2">
                <table>
                  <tr>
                    <td class="title">
                      <img
                        src="https://purepng.com/public/uploads/large/purepng.com-gold-coinsflatcoinsroundmetalgoldclipart-1421526479720qbeuo.png"
                        style="width:100%; max-width:300px;"
                      />
                    </td>

                    <td>
                      หมายเลข #: 00123
                      <br />
                      วันที่: {{createDate}}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr class="information">
              <td colspan="2">
                <table>
                  <tr>
                    <td>
                      Donate-web
                      <br />111/1 กรุงเทพฯ
                      <br />12345
                      <br>เลขประจำตัวผู้เสียภาษี/ Tax ID: xxxxxxxxxxxxx
                    </td>

                    <td>
                      Acme Corp.
                      <br />John Doe
                      <br />john@example.com
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr class="heading">
              <td>Payment Method</td>

              <td></td>
            </tr>

            <tr class="details">
              <td>Internet Banking (เมื่อ {{donateDate}})</td>
            </tr>

            <tr class="heading">
              <td>Item</td>

              <td>Price</td>
            </tr>

            <tr class="item">
              <td>บริจาคโครงการ - {{project.title}}</td>

              <td>{{donataion.amount | currency}}</td>
            </tr>

            <!--  <tr class="item last">
                <td>
                    Domain name (1 year)
                </td>
                
                <td>
                    $10.00
                </td> 
            </tr>-->

            <tr class="total">
              <td></td>

              <td>{{donataion.amount | currency}}</td>
            </tr>
            <br />
          </table>
        </div>
      </b-col>
    </b-row>
    <b-row id="actions">
      <b-col>
        <b-button variant="success" @click="saveStaticDataToFile">Save</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import service from "../../service";
import moment from "moment";
export default {
  props: {
    txid: null
  },
  data() {
    return {
      donataion: {},
      project: {},
      isShow: true
    };
  },
  created() {
    this.getData();
    document.title = "Donate-web | ใบเสร็จรับเงิน";
  },
  computed: {
    createDate() {
      return moment().format("LL");
    },
    donateDate() {
      return moment(this.donataion.time).format("LLL");
    }
  },
  methods: {
    onSave() {
      this.isShow = false;
      setTimeout(this.saveStaticDataToFile, 500);
    },
    saveStaticDataToFile() {
      window.print();
    },
    async getData() {
      try {
        this.donataion = await service.queryByKey(this.txid);
        this.project = await service.queryByKey(this.donataion.project);
      } catch (error) {
        console.error(error);
      }
    }
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

.invoice-box table tr td:nth-child(2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 45px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
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

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}

/** RTL **/
.rtl {
  direction: rtl;
  font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
    sans-serif;
}

.rtl table {
  text-align: right;
}

.rtl table tr td:nth-child(2) {
  text-align: left;
}

/* TITLE */
.title {
  width: 50px;
  height: 50px;
}

/* save button */
.savebutton {
  position: relative;
  left: 250px;
}

.btn {
  background-color: rgb(30, 172, 35);
  border-radius: 8px;
  color: white;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.btnwebsite {
  position: absolute;
  right: 500px;
  background-color: rgb(63, 63, 63);
  border-radius: 8px;
  color: white;
  padding: 10px 68px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

/** For print invoice */
@media print {
  #actions {
    visibility: hidden;
  }
  #invoice,
  #invoice * {
    visibility: visible;
  }
}
</style>