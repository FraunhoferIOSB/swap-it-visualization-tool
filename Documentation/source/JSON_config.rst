..
    Licensed under the MIT License.
    For details on the licensing terms, see the LICENSE file.
    SPDX-License-Identifier: MIT

    Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)

.. _JSON_config:

===========================================
Properties and structure of the JSON config
===========================================

The JSON config is stored in ``configs/default_config.json``. 
Options for customization:
1. **Modify the default configuration:**
     You can directly edit the existing config.json file to suit your needs.

2. **Provide a custom configuration file:**
     Alternatively, you can create your own configuration file (e.g., my_config.json) and place it in the appropriate directory.
     Make sure to update the code accordingly by changing line ``16`` of ``Tool/public/mqtt.js``.

The structure of the JSON config looks like this:     

.. code-block:: json

    [
        {
            "events": [],
            "static": true,
            "x_coordinate": "50",
            "y_coordinate": "50",
            "state": "0",
            "width": "100",
            "height": "80",
            "application_name": "milling_dr1",
            "resource_ip": "docker.host.internal",
            "port": "4071",
            "module_type": "MillingModuleType",
            "module_name": "MillingModule",
            "service_name": "Milling",
            "device_registry": "opc.tcp://localhost:8000",
            "registry_subscriptions": [
                {
                    "object": "State"
                },
                {
                    "object": "Capabilities"
                }
            ],
            "Capabilities": [
                {
                    "variable_name": "test_numeric",
                    "variable_type": "numeric",
                    "Value": "120",
                    "Relational_Operator": "Smaller"
                },
                {
                    "variable_name": "test_string",
                    "variable_type": "string",
                    "Value": "test_string",
                    "Relational_Operator": "EqualString"
                },
                {
                    "variable_name": "test_boolean",
                    "variable_type": "bool",
                    "Value": "false",
                    "Relational_Operator": "IsFalse"
                }
            ],
            "channels": "100",
            "sessions": "100"
        },
        {
            "events": [],
            "static": false,
            "x_coordinate": "200",
            "y_coordinate": "50",
            "state": "0",
            "radius": "20",
            "application_name": "gluing_dr1",
            "resource_ip": "localhost",
            "port": "4061",
            "module_type": "GluingModuleType",
            "module_name": "GluingModule",
            "service_name": "Gluing",
            "device_registry": "opc.tcp://localhost:8000",
            "registry_subscriptions": [
                {
                    "object": "State"
                },
                {
                    "object": "Capabilities"
                }
            ],
            "Capabilities": [
                {
                    "variable_name": "test_numeric",
                    "variable_type": "numeric",
                    "Value": "120",
                    "Relational_Operator": "Smaller"
                },
                {
                    "variable_name": "test_string",
                    "variable_type": "string",
                    "Value": "test_string",
                    "Relational_Operator": "EqualString"
                },
                {
                    "variable_name": "test_boolean",
                    "variable_type": "bool",
                    "Value": "false",
                    "Relational_Operator": "IsFalse"
                }
            ],
            "channels": "100",
            "sessions": "100"
        }
    ]


This is a description of two example resources in a shopfloor.    