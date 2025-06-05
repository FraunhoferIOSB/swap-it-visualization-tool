// Licensed under the MIT License.
// For details on the licensing terms, see the LICENSE file.
// SPDX-License-Identifier: MIT

// Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)


let counter = 0;
let IsItRunning = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('fileButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('textInput1').value = e.target.result;
        };
        reader.readAsText(file);
    }
});

function openModal(type) {
    const modalMap = {
        'Service': 'myServiceModal',
        'Resource': 'myResourceModal',
        'Campaign': 'myCampaignModal'
    };

    const modalId = modalMap[type];
    if (modalId) {
        document.getElementById(modalId).style.display = "block";
    }
}

function openPlot(imageSrc) {
    var modal = document.getElementById("myGunttModal");
    var image = document.getElementById("gunttImage");

    // Set the image dynamically
    image.src = imageSrc + "?t=" + new Date().getTime(); // Prevent caching

    // Show the modal
    modal.style.display = "block";
}

function closeModal(x) {
    if (x == 'Service'){
        document.getElementById("myServiceModal").style.display = "none";
        document.getElementById('textInput_nSingle').value = "";
        document.getElementById('textInputDelaySingle').value = "";
        document.getElementById('textInputPathSingle').value = "";
        document.getElementById('textInputURLSingle').value = "";
        document.getElementById('textInputDashboardHostAddressSingle').value = "";
        document.getElementById('textInputLogInfoSingle').value = "";
        document.getElementById('textInputDevice_RegistryURLSingle').value = "";
        document.getElementById('textInputCustomURLSingle').value = "";
        document.getElementById('textInputNumberDefaultClientsSingle').value = "";
        document.getElementById('textInputAssignmentAgentURLSingle').value = "";
        document.getElementById('output').textContent = "";
    }
    if (x == 'Campaign'){
        document.getElementById("myCampaignModal").style.display = "none";
        document.getElementById('textInput_nCampaign').value = "";
        document.getElementById('textInputDelayCampaign').value = "";
        document.getElementById('textInputPathCampaign').value = "";
        document.getElementById('textInputURLCampaign').value = "";
        document.getElementById('textInputDashboardHostAddressCampaign').value = "";
        document.getElementById('textInputLogInfoCampaign').value = "";
        document.getElementById('textInputDevice_RegistryURLCampaign').value = "";
        document.getElementById('textInputCustomURLCampaign').value = "";
        document.getElementById('textInputNumberDefaultClientsCampaign').value = "";
        document.getElementById('textInputAssignmentAgentURLCampaign').value = "";
        document.getElementById('output').textContent = "";
    }
    if (x == 'Resource'){
        document.getElementById("myResourceModal").style.display = "none";
    }
    if (x == 'Guntt'){
        document.getElementById("myGunttModal").style.display = "none";
    }
}

function openTextfield(content) {
    document.getElementById("myTextfield1").style.display = "block";
    document.getElementById("myTextfield2").style.display = "block";
    document.getElementById("textfieldOutput").textContent = content;
}

function closeTextfield() {
    document.getElementById("myTextfield1").style.display = "none";
    document.getElementById("myTextfield2").style.display = "none";
    document.getElementById("textfieldOutput").textContent = "";
}

function showRunningServices() {
    openTextfield(IsItRunning);
}

function showServiceHistory() {
    openTextfield(counter);
}







document.getElementById('StartDockerButton').addEventListener('click', startDocker);

async function startDocker() {
    try {
        const response = await fetch('/start-docker', {  // Neuer Endpunkt: /run-docker
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.body) {
            throw new Error('ReadableStream not supported.');
        }

    } catch (err) {
        console.error('Error running script:', err);
        document.getElementById('output').textContent = 'Error: ' + err;
    }
}

document.getElementById('StopDockerButton').addEventListener('click', stopDocker);

async function stopDocker() {
    try {
        const response = await fetch('/stop-docker', {  // Neuer Endpunkt: /run-docker
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.body) {
            throw new Error('ReadableStream not supported.');
        }

    } catch (err) {
        console.error('Error running script:', err);
        document.getElementById('output').textContent = 'Error: ' + err;
    }
}

document.getElementById('runSingleButton').addEventListener('click', () => {
    const counterOffset = 4000 + counter;
    const args = {
        n: document.getElementById('textInput_nSingle').value.trim() || 1,
        delay: document.getElementById('textInputDelaySingle').value.trim() || 0,
        path: document.getElementById('textInputPathSingle').value.trim() || "../swap-it-execution-engine/PFDL_Examples/advanced.pfdl",
        url: document.getElementById('textInputURLSingle').value.trim() || `opc.tcp://localhost:${counterOffset}`,
        // dashboard_host_address: document.getElementById('textInputDashboardHostAddressSingle').value.trim() || 'http://localhost:8080',
        dashboard_host_address: document.getElementById('textInputDashboardHostAddressSingle').value.trim() || 'http://host.docker.internal:8080',
        log_info: document.getElementById('textInputLogInfoSingle').value.trim() || true,
        // device_registry_url: document.getElementById('textInputDevice_RegistryURLSingle').value.trim() || 'opc.tcp://localhost:8000',
        device_registry_url: document.getElementById('textInputDevice_RegistryURLSingle').value.trim() || 'opc.tcp://host.docker.internal:8000',
        // custom_url: document.getElementById('textInputCustomURLSingle').value.trim() || 'opc.tcp://localhost:',
        custom_url: document.getElementById('textInputCustomURLSingle').value.trim() || 'opc.tcp://host.docker.internal:',
        number_default_clients: document.getElementById('textInputNumberDefaultClientsSingle').value.trim() || 5,
        assignment_agent_url: document.getElementById('textInputAssignmentAgentURLSingle').value.trim() || null,
        delay_start: document.getElementById('textInputDelayStartSingle').value.trim() || null,
        priority: document.getElementById('textInputPrioritySingle').value.trim() || 2,
        prioritizer_url: document.getElementById('textInputPrioritizerURLSingle').value.trim() || null,
        information_model_path: document.getElementById('textInputInformation_Model_PathSingle').value.trim() || "../swap-it-execution-engine/model/SWAP.Fraunhofer.Execution.Engine.Model.NodeSet2.xml",
        mqtt_url: document.getElementById('textInputMQTTURLSingle').value.trim() || 'localhost',
        // mqtt_url: document.getElementById('textInputMQTTURLSingle').value.trim() || 'host.docker.internal',
        mqtt_port: document.getElementById('textInputMQTTPortSingle').value.trim() || null //1884
    };
    const n = parseInt(args.n);
    counter = (counter < 100) ? counter + n : 0;
    runScript(args);

});

document.getElementById('runCampaignButton').addEventListener('click', () => {
    const counterOffset = 4000 + counter;
    const args = {
        n: document.getElementById('textInput_nCampaign').value.trim() || 5,
        delay: document.getElementById('textInputDelayCampaign').value.trim() || 0,
        path: document.getElementById('textInputPathCampaign').value.trim() || "../swap-it-execution-engine/PFDL_Examples/advanced.pfdl",
        url: document.getElementById('textInputURLCampaign').value.trim() || `opc.tcp://localhost:${counterOffset}`,
        // dashboard_host_address: document.getElementById('textInputDashboardHostAddressCampaign').value.trim() || 'http://localhost:8080',
        dashboard_host_address: document.getElementById('textInputDashboardHostAddressCampaign').value.trim() || 'http://host.docker.internal:8080',
        log_info: document.getElementById('textInputLogInfoCampaign').value.trim() || true,
        // device_registry_url: document.getElementById('textInputDevice_RegistryURLCampaign').value.trim() || 'opc.tcp://localhost:8000',
        device_registry_url: document.getElementById('textInputDevice_RegistryURLCampaign').value.trim() || 'opc.tcp://host.docker.internal:8000',
        // custom_url: document.getElementById('textInputCustomURLCampaign').value.trim() || 'opc.tcp://localhost:',
        custom_url: document.getElementById('textInputCustomURLCampaign').value.trim() || 'opc.tcp://host.docker.internal:',
        number_default_clients: document.getElementById('textInputNumberDefaultClientsCampaign').value.trim() || 5,
        assignment_agent_url: document.getElementById('textInputAssignmentAgentURLCampaign').value.trim() || null,
        delay_start: document.getElementById('textInputDelayStartCampaign').value.trim() || null,
        priority: document.getElementById('textInputPriorityCampaign').value.trim() || 2,
        prioritizer_url: document.getElementById('textInputPrioritizerURLCampaign').value.trim() || null,
        information_model_path: document.getElementById('textInputInformation_Model_PathCampaign').value.trim() || "../swap-it-execution-engine/model/SWAP.Fraunhofer.Execution.Engine.Model.NodeSet2.xml",
        mqtt_url: document.getElementById('textInputMQTTURLCampaign').value.trim() || 'localhost',
        // mqtt_url: document.getElementById('textInputMQTTURLCampaign').value.trim() || 'host.docker.internal',
        mqtt_port: document.getElementById('textInputMQTTPortCampaign').value.trim() || null //1884
    };
    const n = parseInt(args.n);
    counter = (counter < 100) ? counter + n : 0;

    runScript(args);

});


async function runScript(args) {
    console.log("Sending arguments:", args);
    try {
        const response = await fetch('/subprocesses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(args)
        });

        if (!response.body) {
            throw new Error('ReadableStream not supported.');
        }
    } catch (err) {
        console.error('Error running script:', err);
        document.getElementById('output').textContent = 'Error: ' + err;
    }
}

