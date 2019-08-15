"use strict";

const { spawn } = require("child_process");
const fs = require("fs");

exports.getResults = (req, res) => {
    console.log("Study ID", req.params.studyId);
    const statisticalModule = spawn("python3", [
        "./statisticalModule/cardClustering.py",
        req.params.studyId
    ]);

    statisticalModule.stdout.on("data", data => {
        console.log(data.toString());
    });

    statisticalModule.stderr.on("error", error => {
        console.log(error.toString());
    });

    statisticalModule.on("exit", (code, signal) => {
        console.log("Code, signal", code, signal);
        fs.readdir("./statisticalModule/results", (err, files) => {
            console.log("Files in our results folder: ", files);
        });
        res.json({
            url: process.env.RESULTS_HOST_ADDRESS + '/' + req.params.studyId + ".png"
        });
    });
};
