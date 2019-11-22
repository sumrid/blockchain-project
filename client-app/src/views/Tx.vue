<template>
  <div>
    <div class="container">
      <div class="row mt-4">
        <div class="col">
          <h4>รหัสธุรกรรม: {{id}}</h4>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="h4">รายละเอียด</p>
          <hr />
          <p class="h5">- Header -</p>
          <div class="row">
            <dt class="col-sm-3">Block number</dt>
            <dd class="col-sm-9">{{tx.header.number}}</dd>

            <dt class="col-sm-3">hash</dt>
            <dd class="col-sm-9">{{tx.header.data_hash}}</dd>

            <dt class="col-sm-3">previous hash</dt>
            <dd class="col-sm-9">{{tx.header.previous_hash}}</dd>

            <dt class="col-sm-3">tiemstamp</dt>
            <dd class="col-sm-9">{{tx.data.data[0].payload.header.channel_header.timestamp}}</dd>

            <dt class="col-sm-3">nonce</dt>
            <dd class="col-sm-9">{{getNonce}}</dd>
          </div>

          <hr />
          <!-- Input -->
          <div class="row">
            <dt class="col-sm-3">Input</dt>
            <dd class="col-sm-9">{{getInput}}</dd>
          </div>

          <hr>
          <p class="h5">- Read Write set -</p>
          <div class="row">
            <dt class="col-sm-3">Read</dt>
            <dd class="col-sm-9">{{find('reads')}}</dd>

            <dt class="col-sm-3">Write</dt>
            <dd class="col-sm-9">{{find('writes')}}</dd>
          </div>
          <div class="row">

          </div>
          <!--
          <b-table-simple>
            <b-tbody>
              <b-tr>
                <b-th colspan="2">Block number</b-th>
                <b-td colspan="2">{{tx.header.number}}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "../service";
import jsonFind from "json-find";
export default {
  data() {
    return {
      id: null,
      tx: {},
      txObj: {}
    };
  },
  async created() {
    const id = this.$route.params.txid;
    document.title = "Donate-web | Tx " + id;
    this.id = id;
    this.tx = await service.getTx(id);
    this.txObj = jsonFind(this.tx);
  },
  computed: {
    getNonce() {
      const nonce = this.tx.data.data[0].payload.header.signature_header.nonce;
      const data = Buffer.from(nonce.data);
      return data.toString();
    },
    getInput() {
      const inputArgs = this.tx.data.data[0].payload.data.actions[0].payload
        .chaincode_proposal_payload.input.chaincode_spec.input.args;
      let inputStrs = [];
      for (let arg of inputArgs) {
        const str = Buffer.from(arg.data);
        inputStrs.push(str.toString());
      }
      return inputStrs.join(", ");
    }
  },
  methods: {
    find(key) {
      return this.txObj.checkKey(key);
    }
  }
};
</script>