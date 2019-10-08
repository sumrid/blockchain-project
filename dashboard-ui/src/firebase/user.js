import { firestore } from 'firebase';

async function getAllUsers() {
    const resutls = await firestore().collection('users').get();
    let users = [];
    resutls.forEach(snapshot => {
        users.push(snapshot.data());
    });
    return users;
}

async function getUser(uid) {
    const result = await firestore().collection('users').doc(uid).get();
    return result.data();
}

export default {
    getAllUsers,
    getUser
}