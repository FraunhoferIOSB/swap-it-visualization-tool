// Licensed under the MIT License.
// For details on the licensing terms, see the LICENSE file.
// SPDX-License-Identifier: MIT

// Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)


// Load Default-JSON

let JSONconfig;
let queueQueue = [];
let t0 = null;

async function loadConfig() {
    try {
        const response = await fetch('./default_config.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        JSONconfig = await response.json();
        
        drawShopFloor(JSONconfig);
        console.log("Geladene Konfiguration:", JSONconfig);
    } catch (error) {
        console.error("Fehler beim Laden der JSON-Datei:", error);
    }
}
loadConfig();



client.on('connect', function () {
  console.log('Connected to MQTT broker');
  client.subscribe('shopfloor/#', function (err) {
      if (!err) {
          console.log('Subscribed to topic shopfloor/#');
      } else {
          console.log('Failed to subscribe:', err);
      }
  });
});

client.on('message', function (topic, message) {
  console.log(`Received message. Topic: ${topic}, Message: ${message.toString()}`);
  handleMessage(topic, message.toString());
});

function handleMessage(topic, message) {
  console.time("handleMessage");
  let parts = topic.split('/');
  if (topic === "shopfloor") {
    try {
        let data = JSON.parse(message);
        if (Array.isArray(data)) {
            addResources(data);
        } else {
            addOrUpdateResource(data);
        }
    } catch (e) {
        if (e instanceof SyntaxError) {
            console.log("Invalid JSON format");
        } else {
            throw e;
        }
    }
  } else if (parts.length === 3) {
    let resourceApplication_name = parts[1];
    let key = parts[2];
    if (key === "capabilities") {
      try {
        let newCapabilities = JSON.parse(message);
        if (Array.isArray(newCapabilities)) {
            updateListCapabilities(resourceApplication_name, newCapabilities);
        } else {
            updateCapabilities(resourceApplication_name, newCapabilities);
        }
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.log("Invalid JSON format for capabilities");
        } else {
          throw e;
        }
      }
    } else if (key === "queue") {
      try {
        let newqueue = JSON.parse(message);
        console.log(newqueue);
        console.log(newqueue.length);
        newQueue(resourceApplication_name, newqueue, newqueue.length);
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.log("Invalid JSON format for queue");
          console.log(message);
          deleteQueue(resourceApplication_name);
        } else {
          throw e;
        }
      }
    } else if (key === "events") {
      try {
        let newEvents = JSON.parse(message);
        updateEvents(resourceApplication_name, newEvents);
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.log("Invalid JSON format for events");
        } else {
          throw e;
        }
      }
    } else if (key === "getparameter") {
      try {
        let searchparameter = JSON.parse(message);
        getparameter(resourceApplication_name, searchparameter);
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.log("Invalid JSON format for events");
        } else {
          throw e;
        }
      }  
    } else {
      updateResource(resourceApplication_name, key, message);
    }
  } else if (parts.length === 4) {
    let resourceApplication_name = parts[1];
    let key = parts[2];
    let specific = parts[3]
    if (key === "capabilities") {
      try {
        let newSpecific = JSON.parse(message);
        updateSpecificCapability(resourceApplication_name, specific, newSpecific);
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.log("Invalid JSON format for specific capabilities");
        } else {
          throw e;
        }
      }
    }  


  }
  console.timeEnd("handleMessage");
}

function addResources(resources) {
  resources.forEach(newResource => {
    try {
      addOrUpdateResource(newResource);
    } catch (error) {
      console.error(`Error adding or updating resource: ${error.message}`);
    }
  });
}

function addOrUpdateResource(newResource) {
  let resourceFound = false;
  console.log(`Adding or updating resource: ${JSON.stringify(newResource)}`);
  
  for (let i = 0; i < JSONconfig.length; i++) {
    if (JSONconfig[i].application_name === newResource.application_name) {
      Object.assign(JSONconfig[i], newResource);
      resourceFound = true;
      console.log(`Resource ${newResource.application_name} found and updated`);
      drawShopFloor(JSONconfig);
      break;
    }
  }

  if (!resourceFound) {
    JSONconfig.push({ resource: newResource });
    console.log("Resource added");
    drawShopFloor(JSONconfig);
  } else {
    console.log("Resource updated");
    drawShopFloor(JSONconfig);
  }
}


function updateResource(resourceApplication_name, key, value) {
  for (let i = 0; i < JSONconfig.length; i++) {
    let Resource = JSONconfig[i];
    if (Resource.application_name === resourceApplication_name) {
      if (key in Resource) {
        try {
          Resource[key] = `${JSON.parse(value)}`;
          console.log(JSONconfig);
        } catch (e) {
          if (e instanceof SyntaxError) {
            console.log(`es kam ${value} an`);
            console.log(`nur erstes ist ${value[0]}`);
            Resource[key] = value[0];
          } else {
            throw e;
          }
        }
        console.log(`Updated resource ${resourceApplication_name}: set ${key} to ${value}`);
        drawShopFloor(JSONconfig);
      } else {
        console.log(`Key ${key} not found in resource ${resourceApplication_name}`);
      }
      break;
    }
  }
}

function updateListCapabilities(resourceApplication_name, newCapabilities) {
  newCapabilities.forEach(newCapability => {
    try {
      updateCapabilities(resourceApplication_name, newCapability);
    } catch (error) {
      console.error(`Error updating capability list: ${error.message}`);
    }
  });
}



function updateCapabilities(resourceApplication_name, newCapability) {
  for (let i = 0; i < JSONconfig.length; i++) {
    let resource = JSONconfig[i];
    if (resource.application_name === resourceApplication_name) {
      if (resource.capabilities) {
        let existingCapabilityIndex = resource.capabilities.findIndex(capability => capability.variable_name === newCapability.variable_name);

        if (existingCapabilityIndex !== -1) {
          resource.capabilities[existingCapabilityIndex] = newCapability;
        } else {
          resource.capabilities.push(newCapability);
        }
      } else {
        resource.capabilities = [newCapability];
      }
      console.log(`Capabilities updated for resource ${resourceApplication_name}`);
      console.log(JSONconfig);
      drawShopFloor(JSONconfig);
      break;
    }
  }
}

function updateSpecificCapability(resourceApplication_name, specific, newSpecific) {
  for (let i = 0; i < JSONconfig.length; i++) {
    let resource = JSONconfig[i];
    if (resource.application_name === resourceApplication_name) {
      let capabilities = resource.Capabilities;
      for (let j = 0; j < capabilities.length; j++) {
        if (capabilities[j].variable_name === specific) {
          capabilities[j].Relational_Operator = newSpecific.Relational_Operator;
          capabilities[j].Value = newSpecific.Value;
          console.log(`Updated capability ${specific} for resource ${resourceApplication_name}`);
          console.log(JSONconfig);
          drawShopFloor(JSONconfig);
          return;
        }
      }
      console.log(`Capability ${specific} not found for resource ${resourceApplication_name}`);
      return;
    }
  }
  console.log(`Resource ${resourceApplication_name} not found`);
}

function updateEvents(resourceApplication_name, newEvent) {
  for (let i = 0; i < JSONconfig.length; i++) {
    let Resource = JSONconfig[i];
    if (Resource.application_name === resourceApplication_name) {
      const currentTime = getCurrentFormattedTime();
      newEvent.time = currentTime;
      if (!Array.isArray(Resource.events)) {
        Resource.resource.events = [];
      }
      Resource.events.push(newEvent);
      console.log(`Events updated for resource ${resourceApplication_name}`);
      console.log(JSONconfig);
      drawShopFloor(JSONconfig);
      break;
    }
  }
}

function DeleteEvents(resourceApplication_name) {
  for (let i = 0; i < JSONconfig.length; i++) {
    let Resource = JSONconfig[i];
    if (Resource.application_name === resourceApplication_name) {
      if (Array.isArray(Resource.events)) {
        Resource.events = [];
        console.log(`All events deleted for resource ${resourceApplication_name}`);
        console.log(JSONconfig);
        drawShopFloor(JSONconfig);
      }
      break;
    }
  }
}

function getCurrentFormattedTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

function newQueue(resourceApplication_name, newQueueElement, queuelength) {
  for (let i = 0; i < JSONconfig.length; i++) {
    let Resource = JSONconfig[i];
    if (Resource.application_name === resourceApplication_name) {
      Resource.queue = [...(Array.isArray(newQueueElement) ? newQueueElement : [newQueueElement])];
      
      console.log(`Queue replaced for resource ${resourceApplication_name}`);
      console.log(JSON.stringify(JSONconfig));
      drawShopFloor(JSONconfig);
      break;
    }
  }
  let found = false;
  const now = new Date;
  if (!t0) {
    t0 = now;
  }
  const timeInSeconds = ((now - t0) / 1000).toFixed(2);
  const existing = queueQueue.find(r => r.application_name === resourceApplication_name);
  if (existing) {
    existing.length.push(queuelength);
    existing.time.push(Number(timeInSeconds));
  } else {
    queueQueue.push({
      application_name: resourceApplication_name,
      length: [queuelength],
      time: [Number(timeInSeconds)]
    });
  }
  console.log(queueQueue);
}

function deleteQueue(resourceApplication_name) {
  for (let i = 0; i < JSONconfig.length; i++) {
    let Resource = JSONconfig[i];
    if (Resource.application_name === resourceApplication_name) {
      delete Resource.queue;
      console.log(`Queue deleted for resource ${resourceApplication_name}`);
      console.log(JSON.stringify(JSONconfig));
      drawShopFloor(JSONconfig);
      break;
    }
  }
  const now = new Date;
  const timeInSeconds = ((now - t0) / 1000).toFixed(2);
  const existing = queueQueue.find(r => r.application_name === resourceApplication_name);
  if (existing) {
    existing.length.push(0);
    existing.time.push(Number(timeInSeconds));
  }    
}

function getparameter(resourceApplication_name, searchparameter){
  const mqttTopic = "dummyversionofpublication";

  for (let i = 0; i < JSONconfig.length; i++) {
    let Resource = JSONconfig[i];
    if (Resource.application_name === resourceApplication_name) {
      // Prüfe, ob der Suchparameter in der Ressource existiert
      if (searchparameter in Resource) {
        const message = `Parameter '${searchparameter}' already exists in resource ${resourceApplication_name}: The Value is ${Resource[searchparameter]}`;
        console.log(message);
        client.publish(mqttTopic, message);
        console.log(`sollte gepublished sein`);
        return true;
      } else {
        // Parameter existiert nicht, also wird er hinzugefügt
        Resource[searchparameter] = "";
        const message = `Parameter '${searchparameter}' added to resource ${resourceApplication_name} with value: ${""}`;
        console.log(message);
        client.publish(mqttTopic, message);
        // console.log(JSON.stringify(JSONconfig));
        drawShopFloor(JSONconfig);
        return false;
      }
    }
  }
  const message = `Resource '${resourceApplication_name}' not found.`;
  console.log(message);
  client.publish(mqttTopic, message);
  return false;
}

function queue_push(name) {
  const mqttTopic = "queuepush";

  if (name === "all") {
    client.publish(mqttTopic, JSON.stringify(queueQueue));
  } else {
    const selectedApp = queueQueue.find(entry => entry.application_name === name);
    
    if (selectedApp) {
      client.publish(mqttTopic, JSON.stringify([selectedApp]));
    } else {
      console.warn(`Keine Anwendung mit dem Namen "${name}" gefunden.`);
    }
  }
}

function gunttpy (){
  const mqttTopic = "opcua/events";
  const message = '"{plot!}"';
  console.log(message);
  client.publish(mqttTopic, message);
}

function gunttclearpy (){
  const mqttTopic = "opcua/events";
  const message = '"{clear!}"';
  console.log(message);
  client.publish(mqttTopic, message);
}