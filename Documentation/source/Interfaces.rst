Interfaces
============

This section describes the ways the user can use to interact with the backend.

Initialising
------------

A shop floor configuration is loaded per default as a list. So it`s possible to change single resource configuration
without having to rewrite the whole configuration of the entire shop floor. The following code block shows two of the
resources in the per default appearing shop floor.

.. code-block:: json

    [
        {
            "resource": {
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
                        "variable_name": "test numeric",
                        "variable_type": "numeric",
                        "variable_value": "120",
                        "relational_operator": "Smaller"
                    },
                    {
                        "variable_name": "test string",
                        "variable_type": "string",
                        "variable_value": "test string",
                        "relational_operator": "EqualString"
                    },
                    {
                        "variable_name": "test boolean",
                        "variable_type": "bool",
                        "variable_value": "false",
                        "relational_operator": "IsFalse"
                    }
                ],
                "channels": "100",
                "sessions": "100"
            }
        },
        {
            "resource": {
                "events": [],
                "static": true,
                "x_coordinate": "200",
                "y_coordinate": "50",
                "state": "0",
                "width": "100",
                "height": "80",
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
                        "variable_name": "test numeric",
                        "variable_type": "numeric",
                        "variable_value": "120",
                        "relational_operator": "Smaller"
                    },
                    {
                        "variable_name": "test string",
                        "variable_type": "string",
                        "variable_value": "test string",
                        "relational_operator": "EqualString"
                    },
                    {
                        "variable_name": "test boolean",
                        "variable_type": "bool",
                        "variable_value": "false",
                        "relational_operator": "IsFalse"
                    }
                ],
                "channels": "100",
                "sessions": "100"
            }
        }
    ]



MQTT
-------------

There´s a directory called "test_python_scripts" that contains unit tests of the tool. "mqtt_publisher" is a script that
publishes many different changes and additions. To trigger selected manipulations of the configuration there`s a
directory "specific_tests" that contains three python script to test certain manipulations. The connection to the
MQTT-Broker is necessary in every script. It looks like this:

.. code-block:: python

    # This script should add three resources in total





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

    # The publications ....



    client.loop_stop()
    client.disconnect()


At first every library that is needed gets imported, the broker, port and topic are being specified so that the connection
is possible. At the end the client gets disconnected.

adding_resources.py
~~~~~~~~~~~~~~~~~~~

This script should add three resources in total. It contains two publications. The first one adds one resource configuration,
the second adds a list of two resource configurations.

.. code-block:: python

    # example of adding a resource

    new_resource = {
        "resource": {
            "static": False,
            "service_name": "3",
            "application_name": "3",
            "x_coordinate": "100",
            "y_coordinate": "100",
            "radius": "10",
            "state": "1",
        }
    }

    result = client.publish(topic, json.dumps(new_resource))
    print(f"Published to {topic}, result: {result}")
    time.sleep(1) # just to be safe



First the resource ``new_resource`` is set. Then the configuration of the resource gets published with ``client.publish(topic, json.dumps(new_resource))``.


.. code-block:: python
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


The same thing happens in the second part of the example. The only difference is that a list of resource configurations
is published now.


updating_resources.py
~~~~~~~~~~~~~~~~~~~~~

This script changes varius resource configurations

.. code-block:: python

    # examples for updating resources

    result = client.publish(f"{topic}/warehouse_dr1/y_coordinate", "150")
    print(f"Published to {topic}/warehouse_dr1/y_coordinate, result: {result}")

    result = client.publish(f"{topic}/warehouse_dr1/radius", "15")
    print(f"Published to {topic}/warehouse_dr1/radius, result: {result}")
    time.sleep(1) # just to be safe

The first part of the example changes the ``y_coordinate`` of the resource with the ``application_name: warehouse_dr1`` to 150
The second part works in the same way but changes the ``radius`` to 15.


.. code-block:: python

    # example for adding capabilities

    new_capabilities = {
            "variable_name": "neu",
            "variable_type": "None",
            "variable_value": "50",
            "relational_operator": ">"
        }

    result = client.publish(f"{topic}/warehouse_dr1/capabilities", json.dumps(new_capabilities))
    print(f"Published to {topic}/warehouse_dr1/capabilities, result: {result}")
    time.sleep(1) # just to be safe


The Tool checks whether the resource with the ``application_name: warehouse_dr1`` has a capability with ``variable_name: "neu"``.
If the capability is already there, it gets updated. If it`s not there, the capability gets added.
The following examples test this.


.. code-block:: python

    # example for adding capabilities

    new_capabilities = {
            "variable_name": "neu2",
            "variable_type": "None",
            "variable_value": "50",
            "relational_operator": ">"
        }

    result = client.publish(f"{topic}/warehouse_dr1/capabilities", json.dumps(new_capabilities))
    print(f"Published to {topic}/warehouse_dr1/capabilities, result: {result}")
    time.sleep(1) # just to be safe


    new_capabilities = {
            "variable_name": "neu",
            "variable_type": "None",
            "variable_value": "900",
            "relational_operator": ">"
        }

    result = client.publish(f"{topic}/warehouse_dr1/capabilities", json.dumps(new_capabilities))
    print(f"Published to {topic}/warehouse_dr1/capabilities, result: {result}")
    time.sleep(1) # just to be safe




    # example for adding capabilities

    new_capabilities =[{"variable_name":"list1","variable_type":"None","variable_value":"50","relational_operator":">"},{"variable_name":"neu2","variable_type":"list","variable_value":"666","relational_operator":">"}]

    result = client.publish(f"{topic}/warehouse_dr1/capabilities", json.dumps(new_capabilities))
    print(f"Published to {topic}/warehouse_dr1/capabilities, result: {result}")
    time.sleep(1) # just to be safe


The last example publishes a list and the tool splits it up and adds or updates the resource with each part of the list separately.


.. code-block:: python

    # example for adding a queue

    new_queue = [{"Client_Identifier":"Client123","Service_UUID":"abc123-xyz789","Entry_Number":1,"Queue_Element_State":"Pending","ProductId":"Product","ServiceParameter":"ParameterValue1"}]

    result = client.publish(f"{topic}/milling_dr1/queue", json.dumps(new_queue))
    print(f"Published to {topic}/milling_dr1/queue, result: {result}")
    time.sleep(1) # just to be safe

This example adds a queue to the resource ``milling_dr1``. The parameters in the queue are static so far.


.. code-block:: python

    # example of adding events

    new_events = {
        "event": "eins"
    }

    newer_events = {
        "event": "zwei"
    }

    result = client.publish(f"{topic}/milling_dr1/events", json.dumps(new_events))
    print(f"Published to {topic}/dr1..., result: {result}")

    time.sleep(1)

    result = client.publish(f"{topic}/milling_dr1/events", json.dumps(newer_events))
    print(f"Published to {topic}/dr1milling, result: {result}")
    time.sleep(1) # just to be safe

This example adds events which are one second apart. It`s possible to show the events by clicking on the button "events"
and the Tool adds a timestamp.

getparameter.py
~~~~~~~~~~~~~~~

This script looks up whether a specific parameter is already in the resource configuration of interest.
If the parameter is not there yet, the tool adds it to the configuration and sends out a mqtt message.
If the parameter is already there, the tool reads out it`s value and sends out a mqtt message.


.. code-block:: python

    # example of adding a new parameter that does not exist in the current configuration

    parametersearch = "newparameter"

    result = client.publish(f"{topic}/milling_dr1/getparameter", json.dumps(parametersearch))
    print(f"Published to {topic}/milling_dr1/getparameter, result: {result}")
    time.sleep(1) # just to be safe

Per default there's no parameter ``newparameter`` in the configuration of ``milling_dr1`` so the Tool figures it out and
sends a MQTT-message with the information that the parameter ``newparameter`` is added to the configuration now. The value
of the new parameter is empty ("").


.. code-block:: python

    # example of checking whether the parameter is deployed

    parametersearch = "newparameter"

    result = client.publish(f"{topic}/milling_dr1/getparameter", json.dumps(parametersearch))
    print(f"Published to {topic}/milling_dr1/getparameter, result: {result}")
    time.sleep(1) # just to be safe

The same request is send again and the Tool looks up the value of the parameter.


.. code-block:: python

    # example of changing that parameter

    parametersearch = "500"

    result = client.publish(f"{topic}/milling_dr1/newparameter", json.dumps(parametersearch))
    print(f"Published to {topic}/milling_dr1/newparameter, result: {result}")
    time.sleep(1) # just to be safe

Now the value of ``newparameter`` is changed to 500.


.. code-block:: python

    # example of adding a execution time

    parametersearch = "execution_time"

    result = client.publish(f"{topic}/milling_dr1/getparameter", json.dumps(parametersearch))
    print(f"Published to {topic}/milling_dr1/getparameter, result: {result}")
    time.sleep(1) # just to be safe

This example adds a new parameter with the name ``execution_time``.