<template>
    <v-card>
        <v-card-title>
            ชื่อ {{user.name}}
        </v-card-title>
        <v-card-text>
            <p>บัตรประชาชน</p>
            <v-img :src="user.id_card_img" max-width="350">
            </v-img>
        </v-card-text>
        <v-card-actions>
            <v-btn color="success">Approve</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import firebase from '../firebase/user';
export default {
    props: {
        uid: null,
    },
    data() {
        return {
            user: {}
        }
    },
    async created() {
        this.user = await firebase.getUser(this.uid);
    },
    methods: {
        
    },
}
</script>