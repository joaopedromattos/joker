'use strict'

const { spawn } = require('child_process');

exports.getResults = (req, res) => {
    console.log("Study ID", req.params.studyId);
    const statisticalModule = spawn('python3', ['./statisticalModule/cardClustering.py', req.params.studyId]);
    statisticalModule.on('data', (data) => {
        console.log(data);
    })
    statisticalModule.on('exit', (code, signal) => {
        console.log("Code, signal", code, signal);
        res.json({ url : 'http://localhost:3000/' + req.params.studyId + '.png' });
    })
}

