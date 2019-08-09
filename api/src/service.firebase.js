const admin = require('firebase-admin');
const db = admin.firestore();
const projects = db.collection('projects');

exports.saveProject = async (project) => {
    console.log('[save project to firebase]');
    try {
        await projects.doc(project.id).set(project);
        return;
    } catch (err) {
        throw err;
    }
}

checkStatus = () => {
    
}