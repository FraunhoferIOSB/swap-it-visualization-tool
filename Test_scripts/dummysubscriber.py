# Licensed under the MIT License.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: MIT

# Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)


import paho.mqtt.client as mqtt
import json

# MQTT Konfiguration
broker = 'broker.emqx.io'
port = 1883  # Standardport für unverschlüsselte MQTT-Verbindungen
topic = "dummyversionofpublication/#"

# Erstelle eine MQTT-Client-Instanz mit Protokollversion v5
client = mqtt.Client(protocol=mqtt.MQTTv5)

# Callback für erfolgreiche Verbindung
def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("Connected successfully")
        client.subscribe(topic)  # Abonniere das Thema nach erfolgreicher Verbindung
    else:
        print(f"Failed to connect, return code {rc}")

# Callback für empfangene Nachrichten
def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())  # Nachricht als JSON decodieren
    except json.JSONDecodeError:
        payload = msg.payload.decode()  # Falls kein JSON, Nachricht als String decodieren
    
    print(f"Received message on topic {msg.topic}: {payload}")

# Zuweisung der Callbacks
client.on_connect = on_connect
client.on_message = on_message

# Funktion, um den MQTT-Client auszuführen
def run_mqtt_client():
    client.connect(broker, port, 60)  # Verbindung zum Broker herstellen
    client.loop_forever()  # Endlosschleife, um Nachrichten zu empfangen

if __name__ == "__main__":
    run_mqtt_client()  # Startet den MQTT-Client
