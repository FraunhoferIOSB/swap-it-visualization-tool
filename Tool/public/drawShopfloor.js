// Licensed under the MIT License.
// For details on the licensing terms, see the LICENSE file.
// SPDX-License-Identifier: MIT

// Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)



function drawShopFloor(JSONconfig) {
  const CONFIG = { shopfloor: JSONconfig }; 
  console.log(CONFIG);
  console.time("drawShopfloor");
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  if (CONFIG) {

    context.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < CONFIG.shopfloor.length; i++) {
        var entry = CONFIG.shopfloor[i];

        var stateColors = {
            "0": "#D3D3D3", //unknown
            "1": "#90EE90", //operational
            "2": "#FFFF99", //initializing
            "3": "#ff0000", //error
            "4": "#ADD8E6", //idle
            "5": "#e0b0ff"  //executing
        };

        var Farbe = stateColors[entry.state] || "#FFFFFF";
        var ip = entry.resource_ip || 30;
        var port = entry.port || "undefined"
        var x = entry.x_coordinate ||20;
        var y = entry.y_coordinate || 20;
        var width = entry.width || 100;
        var height = entry.height || 60;
        var radius = entry.radius || 13; 
        var application_name = entry.application_name || 50;
        var service_name = entry.service_name || "undefined";
        var state = entry.state || entry.State || "undefined";
        var capabilities = entry.capabilities || entry.Capabilities || [];
        var queue = entry.queue || [];
        var events = entry.events || entry.Events || entry.Event || entry.event;
        if (entry.static === false) {
          drawdot(Farbe, x, y, radius, service_name, application_name, state, capabilities, queue, ip, port, events);
        } else if (entry.static === true) {
          drawrect(Farbe, x, y, width, height, service_name, application_name, state, capabilities, queue, ip, port, events);
        }
        else{console.log('static ist weder false oder true');}

      }
      console.log("wurde gemalt");
  } else {
      console.error("No JSON data found.");
  }
  console.timeEnd("drawShopfloor");
}

function drawrect(Farbe, x, y, width, height, service_name, application_name, state, capabilities, queue, ip, port, events) {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  var borderRadius = 8;

  var scaleX = canvas.width / 1500;
  var scaleY = canvas.height / 600;

  var adjustedX = x * scaleX;
  var adjustedY = y * scaleY;
  var adjustedWidth = width * scaleX;
  var adjustedHeight = height * scaleY;

  context.fillStyle = Farbe;
  context.strokeStyle = "#000000";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(adjustedX + borderRadius, adjustedY);
  context.arcTo(adjustedX + adjustedWidth, adjustedY, adjustedX + adjustedWidth, adjustedY + adjustedHeight, borderRadius);
  context.arcTo(adjustedX + adjustedWidth, adjustedY + adjustedHeight, adjustedX, adjustedY + adjustedHeight, borderRadius);
  context.arcTo(adjustedX, adjustedY + adjustedHeight, adjustedX, adjustedY, borderRadius);
  context.arcTo(adjustedX, adjustedY, adjustedX + adjustedWidth, adjustedY, borderRadius);
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = "#000000";
  context.font = "12px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(service_name, adjustedX + adjustedWidth / 2, adjustedY + adjustedHeight / 2);

  // Kleines Feld als Link unten rechts im Rechteck
  var linkWidth = 50;
  var linkHeight = 20;
  var linkX = adjustedX + adjustedWidth - linkWidth - 5;
  var linkY = adjustedY + adjustedHeight - linkHeight - 5;

  context.fillStyle = "#FFFFFF";
  context.fillRect(linkX, linkY, linkWidth, linkHeight);
  context.strokeRect(linkX, linkY, linkWidth, linkHeight);

  context.fillStyle = "#0000FF";
  context.font = "10px Arial";
  context.fillText("Events", linkX + linkWidth / 2, linkY + linkHeight / 2);

  // Eventlistener für Mausklick auf das Rechteck
  canvas.addEventListener("click", function(event) {
      var rect = canvas.getBoundingClientRect(); // Größe und Position des Canvas auf der Seite
      var mouseX = event.clientX - rect.left; // Mausposition relativ zum Canvas
      var mouseY = event.clientY - rect.top;

      // Überprüfen, ob Mausklick innerhalb des kleinen Feldes liegt
      if (mouseX >= linkX && mouseX <= linkX + linkWidth && mouseY >= linkY && mouseY <= linkY + linkHeight) {
          showEventDetails(adjustedX + adjustedWidth + 10, adjustedY, events, application_name); // Zeige das Feld mit der Variable "events" an
          event.stopPropagation(); // Verhindert, dass das Dokument-Klick-Event sofort das Fenster schließt
      }
       else if (mouseX >= adjustedX && mouseX <= adjustedX + adjustedWidth && mouseY >= adjustedY && mouseY <= adjustedY + adjustedHeight) {
          openNavRect('right', service_name, application_name, x, y, width, height, state, capabilities, queue, ip, port); // Öffne das rechte Menü mit den Eigenschaften des Rechtecks
      }
  });
}

var detailsDiv = null;

function showEventDetails(x, y, events, application_name) {
  // Falls das Details-Feld bereits existiert, entferne es
  if (detailsDiv) {
    detailsDiv.remove();
    detailsDiv = null;
  }

  // Erzeuge und zeige das neue Details-Feld
  detailsDiv = document.createElement("div");
  detailsDiv.classList.add('details-div');
  detailsDiv.style.left = x + "px";
  detailsDiv.style.top = (y+70) + "px";

  // Erstelle das "Delete"-Kästchen oben rechts
  const deleteButton = document.createElement("div");
  deleteButton.classList.add('delete-button');  // Füge nur die Klasse hinzu
  deleteButton.textContent = "Delete";


  // Füge das "Delete"-Kästchen zum Details-Feld hinzu
  detailsDiv.appendChild(deleteButton);

  // Generische Verarbeitung der Events
  let content = "<strong>Events:</strong><br>";
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    content += `<div style="margin-bottom: 5px;">`;
    for (let key in event) {
      if (event.hasOwnProperty(key)) {
        content += `<strong>${key}:</strong> ${event[key]}<br>`;
      }
    }
    content += `</div>`;
  }

  detailsDiv.innerHTML += content;

  document.body.appendChild(detailsDiv);
  setTimeout(() => {
    document.addEventListener("click", function(event) {
      if (detailsDiv && deleteButton) {
        var rect = detailsDiv.getBoundingClientRect();
        var deleteButtonRect = deleteButton.getBoundingClientRect();
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        // Debugging-Ausgaben für das Details-Div-Rettangle
        console.log('Details div bounding rect:', rect);

        // Überprüfen, ob Mausklick innerhalb des Details-Feldes liegt
        if (mouseX >= (rect.left+250) && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
          // Überprüfen, ob Mausklick innerhalb des "Delete"-Buttons liegt
            DeleteEvents(application_name); // Lösche die Events
            console.log('Delete button clicked. Events should be deleted.');
            event.stopImmediatePropagation(); // Verhindert, dass der Klick-Event andere Event-Listener erreicht
            hideEventDetails();
          }
         else {
          hideEventDetails(); // Schließe das Details-Feld, wenn der Klick außerhalb des Details-Feldes liegt
        }
      }
    }, { once: true }); // Füge den Event-Listener nur einmal hinzu
  }, 0); // Verzögere die Ausführung um sicherzustellen, dass das Element gerendert ist
}

function hideEventDetails() {
  if (detailsDiv) {
    detailsDiv.remove();
    detailsDiv = null;
  }
}


// Zeichnen Punkt
function drawdot(Farbe, x, y, radius, service_name, application_name, state, capabilities, queue, ip, port, events) {

  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  context.fillStyle = Farbe;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fill();
  context.strokeStyle = "#000000";
  context.lineWidth = 1;
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.stroke();
  context.fillStyle = "#000000";
  context.font = "12px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(service_name, x, y);

  var scaleX = canvas.width / 1500;
  var scaleY = canvas.height / 600;

  var adjustedX = x * scaleX;
  var adjustedY = y * scaleY;
  // Kleines Feld als Link unten rechts im Rechteck
  var linkWidth = 50;
  var linkHeight = 20;
  var linkX = x - linkWidth - 5;
  var linkY = y - linkHeight - 5;

  context.fillStyle = "#FFFFFF";
  context.fillRect(linkX, linkY, linkWidth, linkHeight);
  context.strokeRect(linkX, linkY, linkWidth, linkHeight);

  context.fillStyle = "#0000FF";
  context.font = "10px Arial";
  context.fillText("Events", linkX + linkWidth / 2, linkY + linkHeight / 2);

  // Eventlistener für Mausklick auf den Punkt
  canvas.addEventListener("click", function(event) {
    var rect = canvas.getBoundingClientRect(); // Größe und Position des Canvas auf der Seite
    var mouseX = event.clientX - rect.left; // Mausposition relativ zum Canvas
    var mouseY = event.clientY - rect.top;

    // Überprüfen, ob Mausklick innerhalb des Punktes liegt
    if (mouseX >= linkX && mouseX <= linkX + linkWidth && mouseY >= linkY && mouseY <= linkY + linkHeight) {
        showEventDetails(adjustedX + 10, adjustedY, events, application_name); // Zeige das Feld mit der Variable "events" an
        event.stopPropagation(); // Verhindert, dass das Dokument-Klick-Event sofort das Fenster schließt
    }
    else if (Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2) <= radius) {
        openNavDot('right', service_name, application_name, x, y, radius, state, capabilities, queue, ip, port); // Öffne das rechte Menü mit den Eigenschaften des Punktes
    }
  });
}

function openNavleft(side) {
    document.getElementById("mySidenavLeft").style.width = "300px";
    document.getElementById("main").style.marginLeft = "300px";
    document.getElementById("text").style.marginLeft = "300px";
    document.getElementById("box").style.marginLeft = "300px";
    document.getElementById("navbar").style.marginLeft = "300px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.7)";
}

function openNavRect(side, service_name, application_name, x, y, width, height, state, capabilities, queue, ip, port) {
  var menuId = (side === 'left') ? "mySidenavLeft" : "mySidenavRight";
  var menuWidth = "250px";
  var menuTextColor = "#f0f0f0ae";
  var marginRightValue = (side === 'right') ? menuWidth : "0px";
  var marginLeftValue = (side === 'left') ? menuWidth : "0px";

  var menu = document.getElementById(menuId);
  var content = "<a href='javascript:void(0)' class='closebtn' onclick='closeNav(\"" + side + "\")'>&times;</a>";
  content += "<h2 style='color: #ffffff'>Application Name: " + application_name + "</h2>";
  content += "<p style='color: " + menuTextColor + "'>Service: " + service_name + "</p>";
  content += "<a href='javascript:void(0)' class='location-link' onclick='toggleDetails(\"location\")'>Location</a>";
  content += "<p id='location-details' class='location-details' style='display: none;'>X: " + x + " Y: " + y + "</p>";
  content += "<a href='javascript:void(0)' class='shape-link' onclick='toggleDetails(\"shape\")'>Shape</a>";
  content += "<p id='shape-details' class='shape-details' style='display: none;'>Width: " + width + " Height: " + height + "</p>";
  openNavBoth(menu, content, menuTextColor, side, state, capabilities, queue, menuWidth, marginLeftValue, marginRightValue, ip, port, application_name);
}

function openNavDot(side, service_name, application_name, x, y, radius, state, capabilities, queue, ip, port) {
  var menuId = (side === 'left') ? "mySidenavLeft" : "mySidenavRight";
  var menuWidth = "250px";
  var menuTextColor = "#f0f0f0ae"; 
  var marginRightValue = (side === 'right') ? menuWidth : "0px";
  var marginLeftValue = (side === 'left') ? menuWidth : "0px";

  var menu = document.getElementById(menuId);
  var content = "<a href='javascript:void(0)' class='closebtn' onclick='closeNav(\"" + side + "\")'>&times;</a>";
  content += "<h2 style='color: #ffffff'>Application Name: " + application_name + "</h2>";
  content += "<p style='color: " + menuTextColor + "'>Service: " + service_name + "</p>";
  content += "<a href='javascript:void(0)' class='location-link' onclick='toggleDetails(\"location\")'>Location</a>";
  content += "<p id='location-details' class='location-details' style='display: none;'>X: " + x + " Y: " + y + "</p>";
  content += "<a href='javascript:void(0)' class='shape-link' onclick='toggleDetails(\"shape\")'>Shape</a>";
  content += "<p id='shape-details' class='shape-details' style='display: none;'>Radius: " + radius + "</p>";
  openNavBoth(menu, content, menuTextColor, side, state, capabilities, queue, menuWidth, marginLeftValue, marginRightValue, ip, port, application_name);
}

function openNavBoth(menu, content, menuTextColor, side, state, capabilities, queue, menuWidth, marginLeftValue, marginRightValue, ip, port, application_name) {
    var stateColors = {
      "0": "asset-state-unknown", //grey
      "1": "asset-state-operational", //green
      "2": "asset-state-initializing", //yellow
      "3": "asset-state-error", //red
      "4": "asset-state-idle", //blue
      "5": "asset-state-executing"  //purple
  };
  var state = stateColors[state] || "#FFFFFF";
  content += "<p style='color: " + menuTextColor + "'>State: " + state + "</p>";
  content += "<p style='color: " + menuTextColor + "'>IP-address: " + ip + "</p>";
  content += "<p style='color: " + menuTextColor + "'>Port: " + port + "</p>";

  // Link für Capabilities
  if (capabilities) {
    content += "<a href='javascript:void(0)' class='capabilities-link' onclick='toggleDetails(\"capabilities\")'>Capabilities</a>";
    content += "<div id='capabilities-details' class='capabilities-details' style='display: none;'>";
    for (var i = 0; i < capabilities.length; i++) {
      content += "<a href='javascript:void(0)' class='capability-item' onclick='toggleDetails(\"capability-" + i + "\")'>" + capabilities[i].variable_name + "</a>";
      content += "<div id='capability-" + i + "-details' class='variable-details' style='display: none;'>";
      content += "<p style='color: " + menuTextColor + "'>variable_type: " + capabilities[i].variable_type + "</p>";
      content += "<p style='color: " + menuTextColor + "'>Value: " + capabilities[i].Value + "</p>";
      content += "<p style='color: " + menuTextColor + "'>Relational_Operator: " + capabilities[i].Relational_Operator + "</p>";
      content += "</div>";
    }
    content += "</div>";
  }
  if (queue) {
    content += "<a href='javascript:void(0)' class='queue-link' onclick='toggleDetails(\"queue\")'>Queue</a>";
    content += "<div id='queue-details' class='queue-details' style='display: none;'>";
    // console.log(queue)
    for (var i = 0; i < queue.length; i++) {
      console.log(queue.length);
      var entry = queue[i];
      content += `<a href='javascript:void(0)' class='queue-element-link' onclick='toggleDetails("queue-element-${i}")'>Element ${i + 1}</a>`;
      content += `<div id='queue-element-${i}-details' class='queue-element-details' style='display: none;'>`;
      console.log(entry);
      content += `<p>Client_Identifier: ${entry.Client_Identifier || "N/A"}</p>`;
      content += `<p>Service_UUID: ${entry.Service_UUID || "N/A"}</p>`;
      content += `<p>Entry_Number: ${entry.Entry_Number || "N/A"}</p>`;
      content += `<p>Queue_Element_State: ${entry.Queue_Element_State || "N/A"}</p>`;
      content += `<p>ProductId: ${entry.ProductId || "N/A"}</p>`;
      if (Array.isArray(entry.ServiceParameter) && entry.ServiceParameter.length > 0) {
        content += `<p>ServiceParameter: ${entry.ServiceParameter.join(", ")}</p>`;
      } else {
        content += `<p>ServiceParameter: N/A</p>`;
      }
      content += `</div>`;
    }
    content += "</div>";
    let applicationName = application_name;
    content += `<button onclick="queue_push('${applicationName}')" class="queue-action-button" style="margin-top: 10px;">Generate Queue Plot</button>`;
    content += `<button onclick="openPlot('images/Heatmap.png')" class="queue-action-button" style="margin-top: 10px;">Show Queue Plot</button>`;
  }


  menu.innerHTML = content;
  menu.style.width = menuWidth;

  var mainMargin = (side === 'left') ? "marginLeft" : "marginRight";
  var textMargin = (side === 'left') ? "marginLeft" : "marginRight";
  var boxMargin = (side === 'left') ? "marginLeft" : "marginRight";
  var navbarMargin = (side === 'left') ? "marginLeft" : "marginRight";

  document.getElementById("main").style[mainMargin] = marginLeftValue;
  document.getElementById("text").style[textMargin] = marginLeftValue;
  document.getElementById("box").style[boxMargin] = marginLeftValue;
  document.getElementById("navbar").style[navbarMargin] = marginLeftValue;

  document.body.style.backgroundColor = "rgba(0,0,0,0.7)";
}

function toggleDetails(type) {
  console.log(`Toggling details for type: ${type}`);
  var details = document.getElementById(type + '-details');
  if (details) {
    details.style.display = (details.style.display === 'none') ? 'block' : 'none';
  } else {
    console.error(`Element with ID "${type}-details" not found.`);
  }
}


function closeNav(side) {
  if (side === 'left') {
    document.getElementById("mySidenavLeft").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("text").style.marginLeft = "0";
    document.getElementById("box").style.marginLeft = "0";
    document.getElementById("navbar").style.marginLeft = "0";
  } else if (side === 'right') {
    document.getElementById("mySidenavRight").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("text").style.marginRight = "0";
    document.getElementById("box").style.marginRight = "0";
    document.getElementById("navbar").style.marginRight = "0";
  }
  document.body.style.backgroundColor = "white";
}

function toggleDropdown(dropdownId) {
  // Get the current dropdown that was clicked
  const currentDropdown = document.getElementById(dropdownId);

  // Close all other dropdowns that are not the current dropdown or its children
  document.querySelectorAll('.dropdown-content').forEach(dropdown => {
      if (dropdown.id !== dropdownId && !dropdown.contains(currentDropdown) && !currentDropdown.contains(dropdown)) {
          dropdown.style.display = 'none';
      }
  });

  // Toggle the display of the current dropdown
  if (currentDropdown.style.display === 'block') {
      currentDropdown.style.display = 'none';
  } else {
      currentDropdown.style.display = 'block';
  }
}

window.onclick = function(event) {
  if (!event.target.matches('.dropdownbar') && !event.target.matches('.dropdownbar-contentbar')) {
    var dropdowns = document.getElementsByClassName("dropdownbar-contentbar");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}