<template>
    <v-container>
        <v-row>
            <v-col>
                <p class="headline">รายชื่อโครงการ</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <project v-for="(item, index) in projects" :key="index" :id="item.id"></project>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import service from '../../service/project';
import project from '@/components/ProjectItem';
export default {
    components: {
        project
    },
    data() {
        return {
            projects: [],
        }
    },
    created() {
        this.getProjects();
    },
    methods: {
        async getProjects() {
            this.projects = await service.getProjects();
        }
    },
}
</script>