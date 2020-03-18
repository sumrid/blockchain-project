<template>
  <b-row>
    <b-col>
      <b-alert show v-if="invoices.length == 0">ไม่มีรายการค่าใช้จ่าย</b-alert>
      <b-table v-else :items="invoices" :fields="fields">
        <template v-slot:cell(total)="data">{{data.value | currency}}</template>

        <template v-slot:cell(details)="row">
          <b-button
            size="sm"
            @click="row.toggleDetails"
            class="mr-2"
            variant="info"
          >{{ row.detailsShowing ? 'ซ่อน' : 'แสดง'}}รายละเอียด</b-button>
        </template>

        <!-- แสดงรายละเอียด -->
        <template v-slot:row-details="row">
          <b-card>
            <b-row>
              <b-col cols="4">
                <p>Number: {{row.item.number}}</p>
                <p>ชื่อ {{row.item.cusname}}</p>
              </b-col>
              <b-col cols="8">
                <p>รายการสินค้า</p>
                <b-list-group>
                  <b-list-group-item
                    v-for="(prod, index) in row.item.items"
                    :key="index"
                  >{{prod.name}} | ราคา: {{prod.price}} | จำนวน: {{prod.amount}}</b-list-group-item>
                </b-list-group>
              </b-col>
            </b-row>
          </b-card>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    invoices: null
  },
  data() {
    return {
      fields: [
        { key: "id", label: "รหัส" },
        { key: "date", label: "วันที่" },
        { key: "total", label: "ราคารวม" },
        { key: "details", label: "รายละเอียด" }
      ]
    };
  }
};
</script>