# Licensed under the MIT License.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: MIT

# Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)


import paho.mqtt.client as mqtt
import json
import time
import os
import threading
import subprocess
from queue import Queue
import sys
import importlib.util
import json
import matplotlib.pyplot as plt
from datetime import datetime
from paho.mqtt.client import Client
import threading
import itertools
import numpy as np
broker = 'host.docker.internal'
# broker = 'localhost' # for testing
port = 1884
topic = "shopfloor/#"
i = 0
message_queue = Queue(maxsize=1000)  
client = mqtt.Client(protocol=mqtt.MQTTv5)

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("Successfully connected to Broker")
        client.subscribe(topic, qos=1) 
    else:
        print(f"Error while connecting with error code: {rc}")

def on_message(client, userdata, msg):
    try:
        message_queue.put_nowait(msg)  
    except Queue.Full:
        print("Too many messages. Message did not get through")

def process_message():
    global i
    while True:
        try:
            msg = message_queue.get()  
            i += 1
            print(f"Message {i}: {msg.payload.decode()} with Topic: {msg.topic}")
        except UnicodeDecodeError as e:
            print(f"Decoding error with code: {e}")
        finally:
            message_queue.task_done()

def run_mqtt_client():
    try:
        client.on_connect = on_connect
        client.on_message = on_message
        client.connect(broker, port, keepalive=60)
        client.loop_forever()
    except KeyboardInterrupt:
        print("MQTT-Client shut down...")
    except Exception as e:
        print(f"MQTT-Client Error: {e}")
    finally:
        client.disconnect()

def run_node_script():
    try:
        print("Start Node.js script...")

        script_dir = os.path.dirname(os.path.abspath(__file__))
        tool_dir = os.path.join(script_dir, 'Tool')
        node_script_path = os.path.join(tool_dir, 'app.js')

        process = subprocess.Popen(
            ["node", node_script_path],
            cwd=tool_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,  
            text=True,
            bufsize=1  
        )

        for stdout_line in iter(process.stdout.readline, ""):
            print(f"[Node.js stdout] {stdout_line.strip()}")

        for stderr_line in iter(process.stderr.readline, ""):
            print(f"[Node.js stderr] {stderr_line.strip()}")

        process.stdout.close()
        process.wait()
        print(f"Node.js stopped with code: {process.returncode}")

    except FileNotFoundError as e:
        print(f"Node.js script not found: {e}")
    except Exception as e:
        print(f"Error running Node.js scripts: {e}")
    finally:
        print("Node.js script stopped")

class MQTTReceiver:
    def __init__(self, broker=broker, port=port, topic="opcua/events"): # for testing
        self.client = Client()
        self.broker = broker
        self.port = port
        self.topic = topic
        self.data = {}  # { ee_url: { service_name: { service_uuid: [timestamps] } } }
        self.lock = threading.Lock()
        self.t0 = None  # First time

    def on_message(self, client, userdata, message):
        event = json.loads(message.payload.decode())
        print(f"Received: {event}")
        if event == "{plot!}":
            print("plot Gantt")
            self.plot_gantt()
        elif event == "{clear!}":
            print("clear Gantt Data")
            self.data = {}
            fig, ax = plt.subplots(figsize=(10, 6))
            ax.set_facecolor('white')
            ax.axis('off')
            text = "No Order Data Available"
            ax.text(0.5, 0.5, text, ha='center', va='center', fontsize=40, color='black')
            plt.savefig("./Tool/public/diagramm.png", dpi=300)
            plt.show()
        else:
            ee_url = event["ee_url"]
            service_name = event["service_name"]
            service_uuid = event["service_uuid"]
            timestamp = datetime.strptime(event["time"], "%Y-%m-%d %H:%M:%S.%f")
            with self.lock:
                if self.t0 is None:
                    self.t0 = timestamp

                if ee_url not in self.data:
                    self.data[ee_url] = {}

                if service_name not in self.data[ee_url]:
                    self.data[ee_url][service_name] = {}

                if service_uuid not in self.data[ee_url][service_name]:
                    self.data[ee_url][service_name][service_uuid] = []

                self.data[ee_url][service_name][service_uuid].append(timestamp)

    def connect(self):
        self.client.on_message = self.on_message
        self.client.connect(self.broker, self.port)
        self.client.subscribe(self.topic)
        print(f"subscribed to {self.topic}")

    def start(self):
        self.client.loop_start()
        try:
            while True:
                pass
        except KeyboardInterrupt:
            print("\nStopping MQTT Receiver...")
            self.client.loop_stop()

    def plot_gantt(self):
        with self.lock:
            if not self.data:
                print("No data to plot.")
                return

            print("Plotting Gantt chart")
            print(self.data)
            fig, ax = plt.subplots(figsize=(10, 6))  # Größere Figur für bessere Lesbarkeit
            y_labels = []
            y_positions = {}
            position = 0

            for ee_url, services in self.data.items():
                y_labels.append(ee_url)
                y_positions[ee_url] = position
                position += 1

                for service_name, uuids in services.items():
                    y_labels.append(f"  {service_name}")
                    y_positions[service_name] = position
                    position += 1

                    for service_uuid, timestamps in uuids.items():
                        if len(timestamps) >= 2:
                            start_time = min(timestamps)
                            end_time = max(timestamps)

                            start_seconds = (start_time - self.t0).total_seconds()
                            end_seconds = (end_time - self.t0).total_seconds()

                            ax.barh(
                                y_positions[service_name],
                                end_seconds - start_seconds,
                                left=start_seconds,
                                height=0.4,
                                label=f"{service_uuid[:8]}",
                                edgecolor="black",  # Schwarzer Rand für Kontrast
                                linewidth=0.8,
                                alpha=0.7  # Leicht transparent
                            )

            ax.set_yticks(range(len(y_labels)))
            ax.set_yticklabels(y_labels)
            ax.set_xlabel("Time / s")
            ax.set_title("Service Execution Timeline (Gantt Chart)")

            # Gitterlinien für bessere Orientierung
            ax.grid(axis="x", linestyle="--", alpha=0.6)

            # Dünne Umrandung der Y-Ticks
            for spine in ax.spines.values():
                spine.set_linewidth(0.5)

            plt.tight_layout()
            plt.savefig("/app/Tool/public/images/diagramm.png", dpi=300)  # Höhere Auflösung
            plt.show()


class MQTTReceiverQueue:
    def __init__(self, broker=broker, port=port, topic="queuepush"):
        print(broker, port)
        self.client = Client()
        self.broker = broker
        self.port = port
        self.topic = topic
        self.lock = threading.Lock()

    def on_message(self, client, userdata, message):
        try:
            queue_data = json.loads(message.payload.decode())
        except json.JSONDecodeError:
            print(f"Invalid JSON: {message.payload}")
            return

        if not isinstance(queue_data, list):
            print(queue_data)
            print("Expected list of applications in queueQueue.")
            return

        print(f"Received queueQueue with {len(queue_data)} applications.")

        with self.lock:
            if len(queue_data) == 1:
                self.plot_single_application(queue_data[0])
            elif len(queue_data) > 1:
                self.plot_heatmap(queue_data)


    def plot_single_application(self, app_data):
        print(app_data)
        try:
            times = [float(t) for t in app_data["time"]]
            lengths = app_data["length"]
            app_name = app_data["application_name"]
        except (KeyError, ValueError) as e:
            print(f"Invalid application data: {e}")
            return

        sorted_pairs = sorted(zip(times, lengths))
        sorted_times, sorted_lengths = zip(*sorted_pairs)
        plt.figure(figsize=(10, 6))
        plt.step(sorted_times, sorted_lengths, where='post', linestyle='-', color='blue')
        plt.axhline(y=0, color='gray', linestyle='--', linewidth=1)
        plt.title(f"Queue course – {app_name}")
        plt.xlabel("Time / s")
        plt.ylabel("Length of queue")
        plt.tight_layout()
        plt.savefig("./Tool/public/images/Heatmap.png", dpi=300)
        print("finished plotting")


    def plot_heatmap(self, apps):
        print(apps)
        try:
            fig, ax = plt.subplots(figsize=(12, 6))
            cmap = plt.get_cmap("Blues")

            # Alle Werte für Normierung sammeln (ohne 0)
            all_lengths = [l for app in apps for l in app["length"] if l > 0]
            vmin = min(all_lengths) if all_lengths else 0
            vmax = max(all_lengths) if all_lengths else 1
            norm = plt.Normalize(vmin=vmin, vmax=vmax)

            for i, app in enumerate(apps):
                times = [float(t) for t in app["time"]]
                lengths = app["length"]
                sorted_pairs = sorted(zip(times, lengths))

                for j in range(len(sorted_pairs) - 1):
                    t_start, l = sorted_pairs[j]
                    t_end = sorted_pairs[j + 1][0]

                    if l > 0:
                        ax.barh(
                            y=i,
                            width=t_end - t_start,
                            left=t_start,
                            height=0.8,
                            color=cmap(norm(l)),
                            edgecolor='black',
                            linewidth=0.5
                        )

                # Optional: Letzter Balken, wenn letzter Wert > 0
                if len(sorted_pairs) > 1 and sorted_pairs[-1][1] > 0:
                    t_last, l_last = sorted_pairs[-1]
                    # z. B. gleiche Breite wie vorheriger Abschnitt
                    default_width = sorted_pairs[-1][0] - sorted_pairs[-2][0]
                    ax.barh(
                        y=i,
                        width=default_width,
                        left=t_last,
                        height=0.8,
                        color=cmap(norm(l_last)),
                        edgecolor='black',
                        linewidth=0.5
                    )

            app_names = [app["application_name"] for app in apps]
            ax.set_yticks(np.arange(len(apps)))
            ax.set_yticklabels(app_names)
            ax.set_xlabel("Time / s")
            ax.set_title("Heatmap of queues")

            sm = plt.cm.ScalarMappable(cmap=cmap, norm=norm)
            sm.set_array([])
            fig.colorbar(sm, ax=ax, label="Length of queue")

            plt.tight_layout()
            plt.savefig("./Tool/public/images/Heatmap.png", dpi=300)
            print("finished plotting")

        except Exception as e:
            print(f"Error producing the plot, with code: {e}")






    def connect(self):
        self.client.on_message = self.on_message
        self.client.connect(self.broker, self.port)
        self.client.subscribe(self.topic)
        print(f"Subscribed to topic: {self.topic}")

    def start(self):
        self.client.loop_forever()

if __name__ == "__main__":
    try:
        receiver = MQTTReceiver()
        receiver.connect()

        receiver_queue = MQTTReceiverQueue()
        receiver_queue.connect()

        mqtt_thread = threading.Thread(target=run_mqtt_client, daemon=True)
        node_thread = threading.Thread(target=run_node_script, daemon=True)
        # worker_thread = threading.Thread(target=process_message, daemon=True)
        receiver_thread = threading.Thread(target=receiver.start, daemon=True)
        receiver_thread_queue = threading.Thread(target=receiver_queue.start, daemon=True)

        mqtt_thread.start()
        node_thread.start()
        # worker_thread.start()
        receiver_thread.start()
        receiver_thread_queue.start()
        mqtt_thread.join()
        node_thread.join()
        # worker_thread.join()
        receiver_thread.join()
        receiver_thread_queue.join()

    except KeyboardInterrupt:
        print("Stop the main program")
    except Exception as e:
        print(f"Error within the main program, with code: {e}")

