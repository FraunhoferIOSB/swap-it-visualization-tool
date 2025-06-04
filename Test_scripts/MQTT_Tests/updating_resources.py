# Licensed under the MIT License.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: MIT

# Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)


# This script should manipulate resources





import paho.mqtt.client as mqtt_client
import json
import time

# Spezifikation des lokalen MQTT-Brokers
broker = 'localhost'
port = 1883
topic = "shopfloor"

client = mqtt_client.Client(protocol=mqtt_client.MQTTv311)


def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("Connected successfully to local broker")
    else:
        print(f"Failed to connect, return code {rc}")

client.on_connect = on_connect

client.connect(broker, port, 60)
client.loop_start()

time.sleep(1) # waiting for connection just to be safe






# # examples for updating resources

# result = client.publish(f"{topic}/warehouse_dr1/y_coordinate", "150")
# print(f"Published to {topic}/warehouse_dr1/y_coordinate, result: {result}")

# result = client.publish(f"{topic}/warehouse_dr1/radius", "15")
# print(f"Published to {topic}/warehouse_dr1/radius, result: {result}")
# time.sleep(1) # just to be safe






# # example for adding capabilities

# new_capabilities = {
#         "variable_name": "neu",
#         "variable_type": "None",
#         "variable_value": "50",
#         "relational_operator": ">"
#     }

# result = client.publish(f"{topic}/warehouse_dr1/capabilities", json.dumps(new_capabilities))
# print(f"Published to {topic}/warehouse_dr1/capabilities, result: {result}")
# time.sleep(1) # just to be safe

# # example for adding capabilities

# new_capabilities = {
#         "variable_name": "neu2",
#         "variable_type": "None",
#         "variable_value": "50",
#         "relational_operator": ">"
#     }

# result = client.publish(f"{topic}/warehouse_dr1/capabilities", json.dumps(new_capabilities))
# print(f"Published to {topic}/warehouse_dr1/capabilities, result: {result}")
# time.sleep(1) # just to be safe


# new_capabilities = {
#         "variable_name": "neu",
#         "variable_type": "None",
#         "variable_value": "900",
#         "relational_operator": ">"
#     }

# result = client.publish(f"{topic}/warehouse_dr1/capabilities", json.dumps(new_capabilities))
# print(f"Published to {topic}/warehouse_dr1/capabilities, result: {result}")
# time.sleep(1) # just to be safe




# # example for adding capabilities

# new_capabilities =[{"variable_name":"list1","variable_type":"None","variable_value":"50","relational_operator":">"},{"variable_name":"neu2","variable_type":"list","variable_value":"666","relational_operator":">"}]

# result = client.publish(f"{topic}/warehouse_dr1/capabilities", json.dumps(new_capabilities))
# print(f"Published to {topic}/warehouse_dr1/capabilities, result: {result}")
# time.sleep(1) # just to be safe


# example for adding a queue

new_queue = [{"Client_Identifier":"c03c2a15-c258-4e59-8c20-e080c90c09e2","Service_UUID":"f830eb28-9a2b-4605-ae88-981666f16625","Entry_Number":1,"Queue_Element_State":3,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"81e8c3c7-e217-4719-97e4-41b7610b095d","Service_UUID":"f04fb36e-1c87-4fe4-8c1d-545e69a927eb","Entry_Number":2,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"6693e5c2-f106-49f9-a6ed-e4d6a6b40f1d","Service_UUID":"32ae1bd4-9b0d-4f47-9161-08dd61d79d10","Entry_Number":3,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"8e7348a0-fb84-4ee5-bf20-f9444849dad0","Service_UUID":"4ae21a49-51ba-47aa-9bf4-8e5918397ff0","Entry_Number":4,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"80d2d236-92fa-472d-96b2-17ab1a042abd","Service_UUID":"ba094a16-03be-4ed6-bb75-73fccf5b75e8","Entry_Number":5,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"e764f39e-b0d2-4f0d-a2b4-bd904f9504ca","Service_UUID":"7a04f9b5-5ce4-4c5b-b028-7fb62664dd64","Entry_Number":6,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]}]

result = client.publish(f"{topic}/gluing_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")
time.sleep(1) # just to be safe


new_queue = [{"Client_Identifier":"e764f39e-b0d2-4f0d-a2b4-bd904f9504ca","Service_UUID":"7a04f9b5-5ce4-4c5b-b028-7fb62664dd64","Entry_Number":6,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]}]

result = client.publish(f"{topic}/gluing_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")
time.sleep(2) # just to be safe

new_queue = [{"Client_Identifier":"c03c2a15-c258-4e59-8c20-e080c90c09e2","Service_UUID":"f830eb28-9a2b-4605-ae88-981666f16625","Entry_Number":1,"Queue_Element_State":3,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"81e8c3c7-e217-4719-97e4-41b7610b095d","Service_UUID":"f04fb36e-1c87-4fe4-8c1d-545e69a927eb","Entry_Number":2,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"6693e5c2-f106-49f9-a6ed-e4d6a6b40f1d","Service_UUID":"32ae1bd4-9b0d-4f47-9161-08dd61d79d10","Entry_Number":3,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"8e7348a0-fb84-4ee5-bf20-f9444849dad0","Service_UUID":"4ae21a49-51ba-47aa-9bf4-8e5918397ff0","Entry_Number":4,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"80d2d236-92fa-472d-96b2-17ab1a042abd","Service_UUID":"ba094a16-03be-4ed6-bb75-73fccf5b75e8","Entry_Number":5,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]}]

result = client.publish(f"{topic}/gluing_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")
time.sleep(4) # just to be safe

new_queue = [{"Client_Identifier":"8e7348a0-fb84-4ee5-bf20-f9444849dad0","Service_UUID":"4ae21a49-51ba-47aa-9bf4-8e5918397ff0","Entry_Number":4,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"80d2d236-92fa-472d-96b2-17ab1a042abd","Service_UUID":"ba094a16-03be-4ed6-bb75-73fccf5b75e8","Entry_Number":5,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"e764f39e-b0d2-4f0d-a2b4-bd904f9504ca","Service_UUID":"7a04f9b5-5ce4-4c5b-b028-7fb62664dd64","Entry_Number":6,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]}]

result = client.publish(f"{topic}/milling_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")
time.sleep(1) # just to be safe

new_queue = ""

result = client.publish(f"{topic}/gluing_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")
time.sleep(1) # just to be safe

new_queue = [{"Client_Identifier":"c03c2a15-c258-4e59-8c20-e080c90c09e2","Service_UUID":"f830eb28-9a2b-4605-ae88-981666f16625","Entry_Number":1,"Queue_Element_State":3,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"81e8c3c7-e217-4719-97e4-41b7610b095d","Service_UUID":"f04fb36e-1c87-4fe4-8c1d-545e69a927eb","Entry_Number":2,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"6693e5c2-f106-49f9-a6ed-e4d6a6b40f1d","Service_UUID":"32ae1bd4-9b0d-4f47-9161-08dd61d79d10","Entry_Number":3,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"8e7348a0-fb84-4ee5-bf20-f9444849dad0","Service_UUID":"4ae21a49-51ba-47aa-9bf4-8e5918397ff0","Entry_Number":4,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"80d2d236-92fa-472d-96b2-17ab1a042abd","Service_UUID":"ba094a16-03be-4ed6-bb75-73fccf5b75e8","Entry_Number":5,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"e764f39e-b0d2-4f0d-a2b4-bd904f9504ca","Service_UUID":"7a04f9b5-5ce4-4c5b-b028-7fb62664dd64","Entry_Number":6,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]}]

result = client.publish(f"{topic}/gluing_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")
time.sleep(1) # just to be safe




new_queue = [{"Client_Identifier":"e764f39e-b0d2-4f0d-a2b4-bd904f9504ca","Service_UUID":"7a04f9b5-5ce4-4c5b-b028-7fb62664dd64","Entry_Number":6,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]}]

result = client.publish(f"{topic}/milling_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")
time.sleep(2) # just to be safe

new_queue = [{"Client_Identifier":"c03c2a15-c258-4e59-8c20-e080c90c09e2","Service_UUID":"f830eb28-9a2b-4605-ae88-981666f16625","Entry_Number":1,"Queue_Element_State":3,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"81e8c3c7-e217-4719-97e4-41b7610b095d","Service_UUID":"f04fb36e-1c87-4fe4-8c1d-545e69a927eb","Entry_Number":2,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"6693e5c2-f106-49f9-a6ed-e4d6a6b40f1d","Service_UUID":"32ae1bd4-9b0d-4f47-9161-08dd61d79d10","Entry_Number":3,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"8e7348a0-fb84-4ee5-bf20-f9444849dad0","Service_UUID":"4ae21a49-51ba-47aa-9bf4-8e5918397ff0","Entry_Number":4,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"80d2d236-92fa-472d-96b2-17ab1a042abd","Service_UUID":"ba094a16-03be-4ed6-bb75-73fccf5b75e8","Entry_Number":5,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]}]

result = client.publish(f"{topic}/gluing_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")
time.sleep(4) # just to be safe

new_queue = [{"Client_Identifier":"8e7348a0-fb84-4ee5-bf20-f9444849dad0","Service_UUID":"4ae21a49-51ba-47aa-9bf4-8e5918397ff0","Entry_Number":4,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"80d2d236-92fa-472d-96b2-17ab1a042abd","Service_UUID":"ba094a16-03be-4ed6-bb75-73fccf5b75e8","Entry_Number":5,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]},{"Client_Identifier":"e764f39e-b0d2-4f0d-a2b4-bd904f9504ca","Service_UUID":"7a04f9b5-5ce4-4c5b-b028-7fb62664dd64","Entry_Number":6,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]}]

result = client.publish(f"{topic}/milling_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")
time.sleep(1) # just to be safe

new_queue = [{"Client_Identifier":"e764f39e-b0d2-4f0d-a2b4-bd904f9504ca","Service_UUID":"7a04f9b5-5ce4-4c5b-b028-7fb62664dd64","Entry_Number":6,"Queue_Element_State":0,"ProductId":"","ServiceParameter":[]}]

result = client.publish(f"{topic}/milling_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")
time.sleep(0.2) # just to be safe


new_queue = ""

result = client.publish(f"{topic}/milling_dr1/queue", json.dumps(new_queue))
print(f"Published to {topic}/milling_dr1/queue, result: {result}")




# # example of adding events

# new_events = {
#     "event": "eins"
# }

# newer_events = {
#     "event": "zwei"
# }

# result = client.publish(f"{topic}/milling_dr1/events", json.dumps(new_events))
# print(f"Published to {topic}/dr1..., result: {result}")

# time.sleep(1)

# result = client.publish(f"{topic}/milling_dr1/events", json.dumps(newer_events))
# print(f"Published to {topic}/dr1milling, result: {result}")
# time.sleep(1) # just to be safe






client.loop_stop()
client.disconnect()