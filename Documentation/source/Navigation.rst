Navigation
==========

In diesem Abschnitt wird beschrieben, welche Möglichkeiten der Nutzer hat, um auf die Seite des simulierten Shopfloors zu gelangen und welche Auswahlmöglichkeiten zur Verfügung stehen.
Diese Möglichkeiten sind auf mehrere Seiten verteilt, welche hier nun einzeln vorgestellt werden.

Startseite
----------

Der Nutzer bekommt als erstes die Startseite angezeigt, auf der er erstmal willkommen geheißen wird aber noch keine Auswahlmöglichkeiten hat.
Er kann nur durch Klicken eines Feldes weiter zur nächsten Seite gelangen

Erste Auswahl
-------------

Auf dieser Seite hat der Nutzer die Wahl zwischen zwei verschiedenen Möglichkeiten

    Configure shop floor
        Klickt der Nutzer auf das Feld mit **Configure shop floor**, wird er auf eine Seite weitergeleitet, auf der ein Eingabefeld auftaucht.
        In diesem Eingabefeld soll die JSON-Konfiguration des Shopfloors eingegeben werden, welche daraufhin gemalt wird **HIER LINK ZUR MAIN**.
        Eine mögliche Eingabe sieht so aus:

        .. code-block:: json

                {
                    "shopfloor": [
                        {
                            "resource": {
                                "static": false,
                                "name": "1",
                                "x_coordinate": "300",
                                "y_coordinate": "50",
                                "radius": "13",
                                "status": "error",
                                "capabilities": [
                                    {
                                        "variable_name": "Variable1",
                                        "variable_type": "None",
                                        "variable_value": "42",
                                        "relational_operator": ">"
                                    },
                                    {
                                        "variable_name": "Variable3",
                                        "variable_type": "None",
                                        "variable_value": "100",
                                        "relational_operator": "<"
                                    }
                                ]
                            }
                        },
                        {
                            "resource": {
                                "static": false,
                                "name": "2",
                                "x_coordinate": "240",
                                "y_coordinate": "100",
                                "radius": "13",
                                "status": "inactive",
                                "capabilities": [
                                    {
                                        "variable_name": "Variable1",
                                        "variable_type": "None",
                                        "variable_value": "42",
                                        "relational_operator": ">"
                                    },
                                    {
                                        "variable_name": "Variable3",
                                        "variable_type": "None",
                                        "variable_value": "100",
                                        "relational_operator": "<"
                                    }
                                ]
                            }
                        }
                    ]
                }

        Diese JSON-Konfiguration wird nun über die POST-Methode der RestAPI zu dieser hinzugefügt.
        Der Codeausschnitt, der diese Methode aufruft ist hier zu sehen:

        .. code-block:: javascript

            function saveJsonData(jsonData) {
                fetch('http://127.0.0.1:5000/resources/all', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Aktualisieren Sie den Content-Type-Header
                    },
                    body: jsonData,
                })
                .then(response => response.json())
                .then(data => {
                    console.log('JSON data saved:', data);
                })
                .catch((error) => {
                    console.error('Error saving JSON data:', error);
                });
            }

        Der Code ist so gestaltet, dass die Variable ``jsonData`` mit dem gefüllt wird, was im Eingabefeld eingegeben wird.


    Template
        Klickt der Nutzer auf dieses Feld, wird automatisch das obere Beispiel als Shopfloor geöffnet.

In beiden Fällen sieht die Ausgabe dann wiefolgt aus

.. figure:: /images/standard.png
   :alt: alternate text
