<template>
  <v-app>
    <router-view name="login">
    </router-view>
      <v-navigation-drawer app>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Dashboard</v-list-item-title>
            <v-list-item-subtitle>เมนู</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item v-for="item in items" :key="item.title" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>sdf
      </v-app-bar>-->

      <v-content>
        <router-view></router-view>
      </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    items: [
      { title: "โครงการ", icon: "mdi-view-dashboard" },
      { title: "ผู้ใช้", icon: "mdi-image" },
      { title: "เกี่ยวกับ", icon: "mdi-help-box" }
    ],
    right: null
  })
};
</script>
