# Licensed under the MIT License.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: MIT

# Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)
# Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Florian Düwel)


# Base-Image
FROM ubuntu:22.04

RUN apt-get update
RUN apt -y install build-essential git gcc make libtool libltdl-dev automake autoconf bison byacc flex libpango1.0-dev
RUN apt-get install -y \
    mosquitto \
    python3 \
    python3-pip \
    nodejs \
    npm \
    git && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /app
COPY . /app

# Python
RUN pip3 install -r requirements.txt

RUN git clone https://gitlab.com/graphviz/graphviz/
WORKDIR /app/graphviz
RUN ./autogen.sh \

	&& ./configure \
    && make \
	&& make -j6 install
RUN dot -c

WORKDIR /app
# Node.js
WORKDIR /app/Tool
RUN npm install

# Set workdir
WORKDIR /app

RUN git clone https://github.com/FlorianDue/swap-it-execution-engine.git
WORKDIR /app/swap-it-execution-engine
RUN git fetch --all
RUN git checkout origin/opcua_service_events -b opcua_service_events_branch

WORKDIR /app


ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED=1

EXPOSE 8083 1884 3000 4000 4001 4002 4003

# start mosquitto demon and tool
CMD ["sh", "-c", "mosquitto -c /etc/mosquitto/mosquitto.conf -d && exec python3 /app/main.py"]
