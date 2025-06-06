<!-- Licensed under the MIT License.
For details on the licensing terms, see the LICENSE file.
SPDX-License-Identifier: MIT

Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)
Copyright 2025 (c) Fraunhofer IOSB (Author: Florian Düwel) -->


# Swap-It-Visualization-Tool
The SWAP-IT Visualization-Tool maps the shop-floor of the [SWAP-IT Architecture](https://github.com/swap-it/demo-scenario/tree/order_prioritization) and exposes states, queues and capabilities of 
the corresponding resources. In addition, it can generate Gantt-Charts of executed processes and illustrate the queue-utilization of 
each resource. Besides, it provides an interface to start processes, executed with a [ExecutionEngine](https://github.com/FlorianDue/swap-it-execution-engine/tree/opcua_service_events).


## Start the Swap-It-Visualisation-Tool

To start the Swap-It-Visualisation-Tool, run the main.py file. The Swap-It-Visualisation-Tool visualizes execution engine processes 
containing resources and their states. 


### Installations

    sudo apt update
	sudo apt install nodejs npm git
    git clone https://github.com/FraunhoferIOSB/swap-it-visualization-tool.git
    cd swap-it-visualization-tool
    pip install -r requirements.txt
	cd Tool
	npm init -y
	sudo npm install express
	sudo npm install
	cd ..
	git clone https://github.com/FlorianDue/swap-it-execution-engine.git
    cd swap-it-execution-engine
    git fetch --all
    git checkout origin/opcua_service_events -b opcua_service_events_branch

### Start the Tool

    python3 main.py

There are no further arguments expected. Before starting the tool, make sure to select the right MQTT port in the code. Open the main.py file and choose the correct broker in line 25-26. If the script is executed locally, the broker should be set to 'localhost'. If the tool is started with docker, the broker should be 'host.docker.internal' accordingly. The latter is the default setting.


## Python Version

```
    3.10.14
```

## Mosquitto Config

For Mosquitto to run properly while starting the tool locally, a mosquitto.conf has to be added on your device. 
The repository should be "/etc/mosquitto/mosquitto.conf" and the configuration should look like this:

``` 

	## WebSocket Listener
	listener 8083
	protocol websockets

	# MQTT Listener v5
	# Enables connections to all IP-Addresses
	listener 1884
	bind_address 0.0.0.0
	protocol mqtt

	# Log-Settings
	log_dest file /var/log/mosquitto/mosquitto.log

	# Persistence
	persistence true
	persistence_location /var/lib/mosquitto/

	# includ config
	include_dir /etc/mosquitto/conf.d

	allow_anonymous true
```

## Docker


The repository contains a Docker file to build a Docker Image of the visualization tool, as well as a docker-compose project, which starts an execution environment, including resources and a registry module

### Build and Run the Docker Image 

```
    docker build -t swap_it_visualization_tool -f Dockerfile .
    
    docker run -p 3000:3000 -p 1884:1884 -p 1883:1883 -P --add-host host.docker.internal:host-gateway swap_it_visualization_tool

``` 

### Docker-compose

```
    docker-compose up
```


## Related Projects

The SWAP-IT-Visualization-Tool is an extension of the SWAP-IT Architecture. Plenty of other projects are published in this context. However, the tool requires for 
its full functionality experimental features, so that the provided links below will lead to the concrete branches of the corresponding repositories:
An short overview about the SWAP-IT Architecture, as well as its components and application can be found in the [DemoScenario](https://github.com/swap-it/demo-scenario/tree/order_prioritization) repository.

- [ExecutionEngine](https://github.com/FlorianDue/swap-it-execution-engine/tree/opcua_service_events)
- [ClientInterface](https://github.com/FraunhoferIOSB/swap-it-client-interface)
- [DemoScenario](https://github.com/swap-it/demo-scenario/tree/order_prioritization)
- [RegistryModule](https://github.com/FraunhoferIOSB/swap-it-registry-module/tree/queue_handling)
- [ServerTemplate](https://github.com/FlorianDue/swap-it-open62541-server-template/tree/order_queue)
- [Dashboard](https://github.com/iml130/swap-it-dashboard)
