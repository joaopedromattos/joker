'use strict';

module.exports = (app) => {
    var researcher = require("../controller/researcherController");
    var study = require("../controller/studyController");
    var board = require("../controller/boardController");

    // Researcher related routes...
    app.route('/researchers')
        .post(researcher.createResearcher) // Create
        // .get(researcher.listResearchers)
    
    app.route('/researchers/email=:email')
        .get(researcher.getResearcher) // Read
    app.route('/researchers/authId=:authId')
        .put(researcher.updateResearcher) // Update
        .delete(researcher.deleteResearcher) // Delete


    // Study related routes...
    app.route('/studies')
        .post(study.createStudy) // Create
        // .get(study.listStudies)
    
    app.route("/studies/_id=:_id")
        .get(study.getStudy) // Read 
        .put(study.updateStudy) // Update
        .delete(study.deleteStudy) // Delete

    app.route("/boards")
        .post(board.createBoard) // Create
        
    app.route("/boards/_id=:_id")
        .get(board.getBoard) // Read
        .put(board.updateBoard) // Update
        .delete(board.deleteBoard) // Delete
}