// Licensed under the MIT License.
// For details on the licensing terms, see the LICENSE file.
// SPDX-License-Identifier: MIT

// Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)


const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'configs')));



// subprocesses

// app.post('/subprocesses', (req, res) => {
//   const { numEE } = req.body;
//   const scriptPath = path.join(__dirname, '../start_subprocesses.py');
//   const pyProg = spawn('python3', ['-u', scriptPath, numEE]);

//   console.log(`Running script: ${scriptPath} with argument: ${numEE}`);
//   res.setHeader('Content-Type', 'text/plain');

//   pyProg.stdout.on('data', (data) => {
//     console.log(`stdout: ${data.toString()}`);
//     res.write(data);
//   });

//   pyProg.stderr.on('data', (data) => {
//     console.error(`stderr: ${data.toString()}`);
//     res.write(`stderr: ${data}`);
//   });

//   pyProg.on('close', (code) => {
//     console.log(`Child process exited with code ${code}`);
//     res.end(`Process finished with code: ${code}`);
//   });
// });



app.post('/subprocesses', (req, res) => {
  const {
    n,
    delay,
    url,
    path: pfdlPath,
    dashboard_host_address,
    log_info,
    device_registry_url,
    custom_url,
    number_default_clients,
    assignment_agent_url,
    delay_start,
    priority,
    prioritizer_url,
    information_model_path,
    mqtt_url,
    mqtt_port
  } = req.body;

  const scriptPath = path.join(__dirname, '../start_subprocesses.py');

  // Alle Argumente als Strings vorbereiten
  const args = [
    '-u',
    scriptPath,
    n,
    delay,
    url,
    pfdlPath,
    dashboard_host_address,
    log_info,
    device_registry_url,
    custom_url,
    number_default_clients,
    assignment_agent_url,
    delay_start,
    priority,
    prioritizer_url,
    information_model_path,
    mqtt_url,
    mqtt_port
  ].map(arg => (arg !== undefined && arg !== null ? arg.toString() : ''));

  const pyProg = spawn('python3', args);

  console.log(`Running script: ${scriptPath} with args: ${args.join(' ')}`);
  res.setHeader('Content-Type', 'text/plain');

  pyProg.stdout.on('data', (data) => {
    console.log(`stdout: ${data.toString()}`);
    res.write(data);
  });

  pyProg.stderr.on('data', (data) => {
    console.error(`stderr: ${data.toString()}`);
    res.write(`stderr: ${data}`);
  });

  pyProg.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
    res.end(`\nProcess finished with code: ${code}`);
  });
});





// Execution engine

// app.post('/start-execution-engine', (req, res) => {
//   const inputData2 = req.body.inputData2;
//   const inputData1 = req.body.inputData1;
//   const inputData3 = req.body.inputData3;
//   const inputData5 = req.body.inputData5;
//   const inputData6 = req.body.inputData6;
//   const scriptPath = path.join(__dirname, '../swap-it-execution-engine/main.py');
//   const startTime = Date.now(); 
//   const pyProg = spawn('python3', [scriptPath, inputData1, inputData2, inputData3, inputData5, inputData6]);
//   console.log(`Running script with args: ${inputData1}, ${inputData2}, ${inputData3}, ${inputData5}, ${inputData6}`);
//   res.setHeader('Content-Type', 'text/plain');
//   pyProg.stdout.on('data', (data) => {
//     res.write(data);
//   });
//   pyProg.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//     res.write(`stderr: ${data}`);
//   });
//   pyProg.on('close', (code) => {
//     const endTime = Date.now();
//     const duration = (endTime - startTime) / 1000;
//     console.log(`child process exited with code ${code}`);
//     console.log(`Execution took ${duration} seconds`); 
//     res.write(`\nExecution took ${duration} seconds`);
//     res.end();
//   });
// });


// start Docker

app.post('/start-docker', (req, res) => {
  console.log("app");
  //const scriptPath = path.join(__dirname, '/app/Tool/DockerResources/start_docker.py');
  const pyProg = spawn('python3', ['/app/Tool/DockerResources/start_docker.py']);
  res.setHeader('Content-Type', 'text/plain');
  pyProg.stdout.on('data', (data) => {
    res.write(data); 
  });
  pyProg.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.write(`stderr: ${data}`);
  });
  pyProg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    res.end(); 
  });
});


// Stop Docker

app.post('/stop-docker', (req, res) => {
  const scriptPath = path.join(__dirname, '/app/Tool/DockerResources/stop_docker.py');
  const pyProg = spawn('python3', [scriptPath]);
  res.setHeader('Content-Type', 'text/plain');
  pyProg.stdout.on('data', (data) => {
    res.write(data);
  });
  pyProg.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.write(`stderr: ${data}`);
  });
  pyProg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    res.end(); 
  });
});


// Listener

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
