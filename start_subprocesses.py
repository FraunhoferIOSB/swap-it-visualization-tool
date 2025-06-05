# Licensed under the MIT License.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: MIT

# Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)

import subprocess
import threading
from datetime import datetime
import time
import sys
import os
from urllib.parse import urlparse

def get_url_with_offset(url, offset):
    parsed = urlparse(url)
    host = parsed.hostname
    port = parsed.port
    scheme = parsed.scheme
    return f"{scheme}://{host}:{port + offset}"

original_workdir = os.getcwd()
times = []

def start_ee(ctr, url, path, dashboard_host_address, log_info, device_registry_url, custom_url, number_default_clients, assignment_agent_url, priority, prioritizer_url, information_model_path, mqtt_url, mqtt_port):
    try:
        full_url = get_url_with_offset(url, ctr)

        cmd = [
            "python3", "../swap-it-execution-engine/main.py",
            # "python3", "/app/swap-it-execution-engine/main.py",
            full_url,
            path,
            f"dashboard_host_address={dashboard_host_address}",
        ]
        if log_info:
            cmd.append(f"log_info={log_info}")
        if device_registry_url:
            cmd.append(f"device_registry_url={device_registry_url}")
        if custom_url:
            cmd.append(f"custom_url={custom_url}")
        if number_default_clients:
            cmd.append(f"number_default_clients={number_default_clients}")
        if assignment_agent_url:
            cmd.append(f"assignment_agent_url={assignment_agent_url}")
        if priority:
            cmd.append(f"priority={priority}")
        if prioritizer_url:
            cmd.append(f"prioritizer_url={prioritizer_url}")
        if information_model_path:
            cmd.append(f"information_model_path={information_model_path}")    
        if mqtt_url:
            cmd.append(f"mqtt_url={mqtt_url}")
        if mqtt_port:
            cmd.append(f"mqtt_port={mqtt_port}")
        print("Start EE with:")
        print(" ".join(cmd))

        subprocess.run(cmd, check=True)

    except subprocess.CalledProcessError as e:
        print(f"Fehler beim Ausführen von subprocess: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Ein unerwarteter Fehler ist aufgetreten: {e}", file=sys.stderr)
        sys.exit(1)

try:
    if len(sys.argv) < 10:
        print("Usage: script.py <n> <delay> <url> <path> <dashboard_host_address> <log_info> <device_registry_url> <custom_url> <number_default_clients> [assignment_agent_url]", file=sys.stderr)

    print("all ", sys.argv)
    # Argumente auslesen
    n = int(sys.argv[1])
    print("n:  ", n)
    delay = float(sys.argv[2])
    print("delay:  ", delay)
    url = sys.argv[3]
    print("url:  ", url)
    path = sys.argv[4]
    print("path:  ", path)
    dashboard_host_address = sys.argv[5]
    print("dashboard_host_address:  ", dashboard_host_address)
    log_info = sys.argv[6]
    print("log_info:  ", log_info)
    device_registry_url = sys.argv[7]
    print("device_registry_url:  ", device_registry_url)
    custom_url = sys.argv[8]
    print("custom_url:  ", custom_url)
    number_default_clients = sys.argv[9]
    print("number_default_clients:  ", number_default_clients)
    assignment_agent_url = sys.argv[10]
    print("assignment_agent_url:  ", assignment_agent_url)
    delay_start = sys.argv[11]
    print("delay_start:  ", delay_start)
    priority = sys.argv[12]
    print("priority:  ", priority)
    prioritizer_url = sys.argv[13]
    print("prioritizer_url:  ", prioritizer_url)
    information_model_path = sys.argv[14]
    print("information_model_path:  ", information_model_path)
    mqtt_url = sys.argv[15]
    print("mqtt_url:  ", mqtt_url)
    mqtt_port = sys.argv[16]
    print("mqtt_port:  ", mqtt_port)    
    # assignment_agent_url = sys.argv[10] if len(sys.argv) > 10 else ""

    start_time = datetime.now()
    threads = []

    for i in range(n):
        try:
            thread = threading.Thread(
                target=start_ee,
                args=(i, url, path, dashboard_host_address, log_info, device_registry_url, custom_url, number_default_clients, assignment_agent_url, priority, prioritizer_url, information_model_path, mqtt_url, mqtt_port)
            )
            thread.start()
            threads.append(thread)
            time.sleep(delay)
        except Exception as e:
            print(f"Fehler beim Erstellen des Threads: {e}", file=sys.stderr)
            sys.exit(1)

    for thread in threads:
        try:
            thread.join()
        except Exception as e:
            print(f"Fehler beim Warten auf den Thread: {e}", file=sys.stderr)
            sys.exit(1)

    end_time = datetime.now()
    time_taken = (end_time - start_time).total_seconds()
    times.append(time_taken)
    print(f"Gesamte Zeit: {time_taken} Sekunden")

except Exception as e:
    print(f"Ein Fehler ist aufgetreten: {e}", file=sys.stderr)
    sys.exit(1)
finally:
    os.chdir(original_workdir)
