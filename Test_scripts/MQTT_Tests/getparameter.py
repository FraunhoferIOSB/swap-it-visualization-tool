# Licensed under the MIT License.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: MIT

# Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)


# This script should demonstrate the getparameter function





import paho.mqtt.client as mqtt_client
import json
import time







# specification of the mqtt-broker and starting the connection

broker = 'broker.emqx.io'
port = 1883
topic = "shopfloor"

client = mqtt_client.Client(protocol=mqtt_client.MQTTv5)

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("Connected successfully")
    else:
        print(f"Failed to connect, return code {rc}")

client.on_connect = on_connect

client.connect(broker, port, 60)
client.loop_start()
time.sleep(1) # waiting for connection just to be safe






# example of adding a new parameter that does not exist in the current configuration

parametersearch = "newparameter"

result = client.publish(f"{topic}/milling_dr1/getparameter", json.dumps(parametersearch))
print(f"Published to {topic}/milling_dr1/getparameter, result: {result}")
time.sleep(1) # just to be safe 






# example of checking whether the parameter is deployed

parametersearch = "newparameter"

result = client.publish(f"{topic}/milling_dr1/getparameter", json.dumps(parametersearch))
print(f"Published to {topic}/milling_dr1/getparameter, result: {result}")
time.sleep(1) # just to be safe






# example of changing that parameter

parametersearch = "500"

result = client.publish(f"{topic}/milling_dr1/newparameter", json.dumps(parametersearch))
print(f"Published to {topic}/milling_dr1/newparameter, result: {result}")
time.sleep(1) # just to be safe






# example of adding a execution time

parametersearch = "execution_time"

result = client.publish(f"{topic}/milling_dr1/getparameter", json.dumps(parametersearch))
print(f"Published to {topic}/milling_dr1/getparameter, result: {result}")
time.sleep(1) # just to be safe






client.loop_stop()
client.disconnect()