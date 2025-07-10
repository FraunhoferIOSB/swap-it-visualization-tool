<!-- Licensed under the MIT License.
For details on the licensing terms, see the LICENSE file.
SPDX-License-Identifier: MIT

Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel) -->


# Swap-It-Visualisation-Tool

## Start the Swap-It-Visualisation-Tool

To start the Swap-It-Visualisation-Tool, run the main.py file. The Swap-It-Visualisation-Tool visualizes execution engine processes containing resources and thier states. 

### Docker


The whole environment will start automatically when you execute

```
    docker compose up
```

### Run the main.py file locally

The main.py file can be started from a terminal with:

```
    python3 main.py
```

There are no further arguments expected. Before starting the tool, make sure to select the right MQTT port in the code. Open the main.py file and choose the correct broker in line 25-26. If the script is executed locally, the broker should be set to 'localhost'. If the tool is started with docker, the broker should be 'host.docker.internal' accordingly. The latter is the default setting.  

## Documentation

Please take five minutes for the Documentation. You can build the html Documentation by executing:

```
	sphinx-build -M html Documentation/source/ Documentation/_build/html
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
