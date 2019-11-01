<template>
    <v-card class="ma-4">
        <v-card-title>{{project.title}}</v-card-title>
    </v-card>
</template>

<script>
import service from '../service/project';
export default {
    props: {
        id: null
    },
    data() {
        return {
            project: {}
        }
    },
    created() {
        this.getProject();
    },
    methods: {
        async getProject() {
            this.project = await service.getProject(this.id);
        }
    },
}
</script>