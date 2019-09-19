<template>
  <v-container>
    <v-row class="row">
      <v-col id="x">
        <p class="display-1 text-center">สินค้า</p>
      </v-col>
    </v-row>

    <v-row>
      <v-card class="mx-auto card" max-width="400" v-for="p in products" :key="p.name">
        <v-img
          class="white--text"
          height="200px"
          max-width="400px"
          max-height="300px"
          min-width="400px"
          :src="p.img"
        >
          <v-card-title class="align-end fill-height">{{p.name}}</v-card-title>
        </v-img>

        <v-card-text>
          <span>ราคา {{p.price}} บาท</span>
          <br />
          <span class="text--primary">
            <span>Whitehaven Beach</span>
            <br />
            <span>Whitsunday Island, Whitsunday Islands</span>
          </span>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="orange" @click="addToCart(p)">
            <v-icon>{{icons.buy}}</v-icon>ซื้อ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-container class="blue lighten-4 cart-box" elevation="2">
      <v-row>
        <v-col>
          <p class="display-1 text-center">ใบสั่งซื้อ</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <code>{{invoice}}</code>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>Total : {{total}} บาท</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-btn :disabled="!Boolean(total)" @click="sendInvoice">
            <v-progress-circular indeterminate color="primary" v-if="isLoading"></v-progress-circular>
            <v-icon>{{icons.cart}}</v-icon>ซื้อเลยยย
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" :bottom="true" color="success">
      รหัสใบสั่งซื้อคือ {{ popUpText }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import moment from "moment";
import data from "../data";
const axios = require("axios").default;
const url = window.location.hostname;

export default {
  data() {
    return {
      products: data.products.slice(),
      invoice: {
        id: moment()
          .unix()
          .toString(),
        number: moment().unix(),
        total: 0,
        cusname: "customer name",
        items: [],
        date: moment().toDate()
      },
      icons: {
        cart: "mdi-cart",
        buy: "mdi-cart-arrow-down"
      },
      isLoading: false,
      snackbar: false,
      popUpText: ""
    };
  },
  computed: {
    total: function() {
      let total = 0;
      this.invoice.items.forEach(item => {
        total += item.price * item.amount;
      });
      // this.invoice.total = total;
      return total;
    }
  },
  methods: {
    addToCart: function(item) {
      let i = this.invoice.items.find(each => each.name === item.name);
      if (i) {
        i.amount++;
      } else {
        i = {
          name: item.name,
          price: item.price,
          amount: 1
        };
        this.invoice.items.push(i);
      }
    },
    sendInvoice: async function() {
      this.isLoading = true;
      const URL = `http://${url}:8080/api/invoice`;
      this.invoice.total = this.total;
      axios
        .post(URL, this.invoice)
        .then(res => {
          console.log(res.data);
          this.popUp(this.invoice.id);
          this.isLoading = false;
          this.setUpInvoice();
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    setUpInvoice: function() {
      this.invoice = {
        id: moment()
          .unix()
          .toString(),
        number: moment().unix(),
        items: [],
        total: 0,
        cusname: "customer name",
        date: moment().toDate()
      };
    },
    popUp: function(id) {
      this.popUpText = id;
      this.snackbar = true;
    }
  }
};
</script>

<style>
.card {
  margin: 1rem;
}
.cart-box {
  border-radius: 1rem;
}
</style>