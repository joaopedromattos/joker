"use strict";

const mongoose = require("mongoose");
const { spawn } = require("child_process");
const fs = require("fs");
const Board = mongoose.model("Board");

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
            url: req.params.studyId + ".png"
        });
    });
};

exports.downloadDendrogram = (req, res) => {
    const { studyId } = req.params;

    res.download("./statisticalModule/results/" + studyId + ".png");
};

exports.downloadJson = (req, res) => {
    const { studyId } = req.params;

    Board.find({ studyId: studyId }, (err, data) => {
        if (err) {
            console.log("createWelcomeBoard error...");
            res.send(err);
        } else {
            fs.writeFile(
                `./statisticalModule/json/${studyId}.json`,
                JSON.stringify(data),
                "utf8",
                err => {
                    if (err) {
                        res.json(err);
                    } else {
                        res.download(
                            "./statisticalModule/json/" + studyId + ".json"
                        );
                    }
                }
            );
        }
    });
};
