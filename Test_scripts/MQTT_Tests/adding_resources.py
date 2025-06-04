# Licensed under the MIT License.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: MIT

# Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)


# This script should add three resources in total





import paho.mqtt.client as mqtt_client
import json
import time

broker = 'localhost'
port = 1883
topic = "shopfloor"

client = mqtt_client.Client(protocol=mqtt_client.MQTTv5)


def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("Connected successfully to local broker")
    else:
        print(f"Failed to connect, return code {rc}")

client.on_connect = on_connect

client.connect(broker, port, 60)
client.loop_start()

time.sleep(1) # waiting for connection just to be safe






# example of adding a resource

new_resource = {
        "static": False,
        "service_name": "3",
        "application_name": "3",
        "x_coordinate": "100",
        "y_coordinate": "100",
        "radius": "10",
        "state": "1",
}

result = client.publish(topic, json.dumps(new_resource))
print(f"Published to {topic}, result: {result}")
time.sleep(1) # just to be safe






# example for adding a list of resources

newResources = [
    {
        "resource": {
            "static": True,
            "service_name": "3",
            "application_name": "9",
            "x_coordinate": "400",
            "y_coordinate": "200",
            "width": "150",
            "height": "50",
            "state": "5",
            "capabilities": [
                { "variable_name": "Variable2", "variable_type": "None", "variable_value": "50", "relational_operator": ">" }
            ],
            "queue": [{"serviceUUID": "ICH"}, {"processUUID": "HABS"}, {"parameter": "GESCHAFFT"}]
        }
    },
    {
        "resource": {
            "static": False,
            "service_name": "4",
            "application_name": "15",
            "x_coordinate": "500",
            "y_coordinate": "150",
            "radius": "18",
            "state": "2",
            "capabilities": [
                { "variable_name": "Variable3", "variable_type": "None", "variable_value": "80", "relational_operator": ">" }
            ],
            "queue": [{"serviceUUID": "ICH"}, {"processUUID": "HABS"}, {"parameter": "GESCHAFFT"}]
        }
    }
]

result = client.publish(topic, json.dumps(newResources))
print(f"Published to {topic}, result: {result}")
time.sleep(1) # just to be safe






client.loop_stop()
client.disconnect()
