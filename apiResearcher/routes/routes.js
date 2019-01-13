'use strict';

module.exports = (app) => {
    var researcher = require("../controller/researcherController");

    app.route('/researchers')
        .post(researcher.createResearcher)
        // .get(researcher.listResearchers)
    
    app.route('/researchers/email=:email')
        .get(researcher.getResearcher)
        .put(researcher.updateResearcher)
        .delete(researcher.deleteResearcher)

}