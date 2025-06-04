<!-- Licensed under the MIT License.
For details on the licensing terms, see the LICENSE file.
SPDX-License-Identifier: MIT

Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel) -->


# Swap-It-Visualisation-Tool

## Start the Swap-It-Visualisation-Tool

To start the Swap-It-Visualisation-Tool, run the main.py file. The Swap-It-Visualisation-Tool visualizes execution engine processes containing resources and thier states. 

### Run the main.py file

The main.py file can be started from a terminal with:
```
    python3 main.py
```

There are no further arguments expected. Before starting the tool, make sure to select the right MQTT port in the code. Open the main.py file and choose the correct broker in line 25-26. If the script is executed locally, the broker should be set to 'localhost'. If the tool is started with docker, the broker should be 'host.docker.internal' accordingly. The latter is the default setting.  

## Installation

```
    pip install -r requirements.txt
```
Besides, NodeJs (https://nodejs.org/) must be installed on the system.

## Python Version

```
    3.10.14
```
<!-- 
## Start Docker Environment

To start the Docker environment you have to click on the three stripes in the upper left corner of the canvas to open the side navigation bar.
After that click on "Start Resources" and then again on "Start Resources". After that there is a little window with "Start Docker" and "Stop Docker". The Buttons do what they are saying. When you start the Docker environment you can allways observe the current state of the environment in the terminal you startet the tool with. -->

## Start Execution Engine

To start the Execution Engine you have to start the Docker environment first and wait until the images are downloaded if you run the tool locally. When they are running it is possible to start the Execution Engine by clicking on the three stripes in the upper left corner and than on "Start Order", again on "Start Order" and then either on "Start Campaign" or "Start single Order". The only difference among these to options is the default setting on the number of started processes. You can declair the mendatory and not mandatory arguments you need for starting the Exeution Engine in the window that popped up. By clicking "Run", the Execution Engine(s) start(s).

## Mosquitto Config

For Mosquitto to run properly while starting the tool locally, a mosquitto.conf has to be added on your device. The repository should be "/etc/mosquitto/mosquitto.conf" and the configuration should look like this:

``` 

	## WebSocket Listener
	listener 8083
	protocol websockets

	# MQTT Listener v5
	# Erlaubt Verbindungen auf allen IP-Adressen
	listener 1884
	bind_address 0.0.0.0
	protocol mqtt

	# Log-Einstellungen
	log_dest file /var/log/mosquitto/mosquitto.log

	# Persistenz
	persistence true
	persistence_location /var/lib/mosquitto/

	# Zusätzliche Konfigurationen einbeziehen
	include_dir /etc/mosquitto/conf.d

	allow_anonymous true
```










``` 
	sudo apt update
	sudo apt install nodejs npm
	cd Tool
	npm init -y
	sudo npm install express
	sudo npm install
	cd ..
	git clone https://github.com/FraunhoferIOSB/swap-it-execution-engine.git
	python3 main.py
```	



## Start the Swap-It-Visualisation-Tool

