'use strict';

module.exports = (app) => {
    var researcher = require("../controller/researcherController");
    var study = require("../controller/studyController");
    var board = require("../controller/boardController");
    var welcome = require("../controller/createWelcomeBoard");
    var getResults = require("../controller/getResults");

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
        .get(board.listBoard)

    app.route("/boards/studyId=:studyId")
        .post(board.createBoard) // Create
        .get(board.getBoard) // Read

    app.route("/boards/_id=:_id")
        .put(board.updateBoard) // Update
        .delete(board.deleteBoard) // Delete

    // Welcome board template is created
    app.route("/fetchBoard/_id=:_id")
        .get(welcome.createWelcomeBoard)

    // Making a GET request will process your studies here...
    app.route('/getResults/studyId=:studyId')
        .get(getResults.getResults)

    app.route('/countResults/studyId=:studyId')
        .get(board.countBoards)
}   
