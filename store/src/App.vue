<template>
  <v-app>
    <v-navigation-drawer
      class="blue accent-6"
      dark
      app
      v-model="drawer"
    >
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="page(item.route)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline text-uppercase">
        <v-icon large color="blue darken-1">mdi-storefront</v-icon>
        <span class="font-weight-light">ร้านค้า...</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    drawer: false,
    items: [
          { title: 'หน้าแรก', icon: 'mdi-storefront', route: '/' },
          { title: 'ตะกร้า', icon: 'mdi-clipboard-text', route: 'cart' },
        ],
  }),
  methods: {
    page: function(route) {
      console.log(route);
      this.$router.push(route);
    }
  }
};
</script>
