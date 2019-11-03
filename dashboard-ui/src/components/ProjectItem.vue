<template>
  <v-card class="ma-4" :loading="isLoading">
    <v-card-title>
      <p>โครงการ: {{project.title}}</p>
    </v-card-title>
    <v-card-text>
      <p>โดย {{project.owner}}</p>
      <p>เป้าหมาย: {{project.goal}}</p>
      <p>สถานะ: {{project.status}}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue lighten-3">
        <v-icon>mdi-book-open</v-icon> รายละเอียด
      </v-btn>
      <v-btn
        color="green lighten-3"
        depressed
        v-if="project.status == 'pending'"
        @click="onApprove"
      >
        <v-icon>mdi-check</v-icon>Approve
      </v-btn>
      <v-btn color="green lighten-3" depressed disabled v-else>
        <v-icon>mdi-check</v-icon>Approved
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn outlined rounded>...</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import service from "../service/project";
export default {
  props: {
    id: null
  },
  data() {
    return {
      project: {},
      isLoading: false
    };
  },
  created() {
    this.getProject();
  },
  computed: {
    buttonText() {
      const status = this.project.status;
      if (status == "fail") return "";
    }
  },
  methods: {
    async getProject() {
      this.isLoading = true;
      this.project = await service.getProject(this.id);
      this.isLoading = false;
    },
    async onApprove() {
      console.info(`[info] click on approve`);
      try {
        this.isLoading = true;
        const data = await service.approveProject("admin", this.project.id, "open");
        this.project.status = "open";
        this.isLoading = false;
      } catch (error) {
        console.error(error);
        this.isLoading = false;
      }
    }
  }
};
</script>