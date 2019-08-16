const uid = require('uuid/v4');

module.exports = class Project {
    constructor() {
        this.id = uid();
    }
}