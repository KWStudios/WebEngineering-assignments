/*jslint node: true */
/*jslint esversion: 6*/
/*jslint eqeqeq: true */

var express = require('express');
var app = express();
var fs = require("fs");
var expressWs = require('express-ws')(app);
var http = require('http');

var simulation = require('./simulation.js');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var uuid = require('uuid');

var user = { email: "", password: "" };
var devices = {};
var cert = "";
var pemFile = "";

// Session specific storage
var failedLogins = 0;
var startDate = new Date();
var verifiedClientIds = [];
// End Session specific storage

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

//TODO Implementieren Sie hier Ihre REST-Schnittstelle
/* Ermöglichen Sie wie in der Angabe beschrieben folgende Funktionen:
 *  Abrufen aller Geräte als Liste ✅
 *  Hinzufügen eines neuen Gerätes ✅
 *  Löschen eines vorhandenen Gerätes ✅
 *  Bearbeiten eines vorhandenen Gerätes (Verändern des Gerätezustandes und Anpassen des Anzeigenamens) ✅
 *  Log-in und Log-out des Benutzers ✅
 *  Ändern des Passworts ✅
 *  Abrufen des Serverstatus (Startdatum, fehlgeschlagene Log-ins). ✅
 *
 *  BITTE BEACHTEN!
 *      Verwenden Sie dabei passende Bezeichnungen für die einzelnen Funktionen.
 *      Achten Sie bei Ihrer Implementierung auch darauf, dass der Zugriff nur nach einem erfolgreichem Log-In erlaubt sein soll.
 *      Vergessen Sie auch nicht, dass jeder Client mit aktiver Verbindung über alle Aktionen via Websocket zu informieren ist.
 *      Bei der Anlage neuer Geräte wird eine neue ID benötigt. Verwenden Sie dafür eine uuid (https://www.npmjs.com/package/uuid, Bibliothek ist bereits eingebunden).
 */


function readUser() {
    "use strict";
    //TODO Lesen Sie die Benutzerdaten aus dem login.config File ein.
    fs.readFile('resources/login.config', 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        console.log(data);
        user.email = data.split(' ')[1].split('\n')[0].toLowerCase().trim();
        user.password = "" + data.split(' ')[2].trim();
    });
}

app.get("/test", function (req, res) {
    "use strict";
    res.send("email: " + user.email + "\npassword: " + user.password + "\n");
});

function readDevices() {
    "use strict";
    //TODO Lesen Sie die Gerätedaten aus der devices.json Datei ein.
    /*
     * Damit die Simulation korrekt funktioniert, müssen Sie diese mit nachfolgender Funktion starten
     *      simulation.simulateSmartHome(devices.devices, refreshConnected);
     * Der zweite Parameter ist dabei eine callback-Funktion, welche zum Updaten aller verbundenen Clients dienen soll.
     */

     fs.readFile('resources/devices.json', 'utf8', function (err, data) {
         if (err) {
           return console.log(err);
         }
         devices = JSON.parse(data);
         console.log(devices.devices[0].id);
     });
}

function readCert() {
  cert = fs.readFileSync('resources/keys/private.key');
  pemFile = fs.readFileSync('resources/keys/public.pem');
}

function checkToken(req, res) {
  var auth = req.get("Authorization");
  if (auth === undefined) {
    res.status(403).json({ success: false, error: "You must provide a Authorization header in every request." });

    failedLogins++;
    return false;
  }
  // Replace Bearer if it is at the beginning of the Authorization header as this is a default value for jwt authorization
  var token = auth.trim().replace(/^(Bearer)/, "").trim();
  try {
    jwt.verify(token, pemFile);
    return true;
  } catch(err) {
    res.status(403).json({ success: false, error: "The given token is invalid.", exception: err });

    failedLogins++;
    return false;
  }
}

function refreshConnected() {
    "use strict";
    //TODO Übermitteln Sie jedem verbundenen Client die aktuellen Gerätedaten über das Websocket
    /*
     * Jedem Client mit aktiver Verbindung zum Websocket sollen die aktuellen Daten der Geräte übermittelt werden.
     * Dabei soll jeder Client die aktuellen Werte aller Steuerungselemente von allen Geräte erhalten.
     * Stellen Sie jedoch auch sicher, dass nur Clients die eingeloggt sind entsprechende Daten erhalten.
     *
     * Bitte beachten Sie, dass diese Funktion von der Simulation genutzt wird um periodisch die simulierten Daten an alle Clients zu übertragen.
     */

     var updateWss = expressWs.getWss('/update');
     updateWss.clients.forEach(function (client) {
       var contains = false;
       for (var i = 0; i < verifiedClientIds.length; i++) {
         if(verifiedClientIds[i] === client) {
           if(!contains) {
             contains = true;
             client.send(JSON.stringify(devices));
           }
         }
        }
     });
}

// ******* Routes *******

app.post("/login", function (req, res) {
    "use strict";
    // Checks the request header for "email" and "password".
    // Returns the token as the body response if email and password did match.

    if (req.get("email") === undefined || req.get("password") === undefined) {
      res.status(403).json({ success: false, error: 'Email and Password must be provided as header values.' });
      return;
    }
    var email = req.get("email").toLowerCase().trim();
    var password = req.get("password").trim();
    if (email !== user.email || password !== user.password) {
      res.status(403).json({ success: false, error: 'Email and/or Password did not match.' });
      return;
    }

    var token = jwt.sign({ big: 'big', smart: 'smart', home: 'home' }, cert, { algorithm: 'RS256'});

    res.json({ success: true, token: token });
});

app.get("/devices", function (req, res) {
  "use strict";
  // Returns an array of devices
  if (!checkToken(req, res)) {
    return;
  }

  res.json({ success: true, devices: devices.devices });
});

app.get("/health_check", function (req, res) {
  "use strict";
  // Returns a health check
  res.json({ start_date: startDate, failed_logins: failedLogins });
});

app.post("/updateCurrent", function (req, res) {
    "use strict";
    // TODO: Vervollständigen Sie diese Funktion, welche den aktuellen Wert eines Gerätes ändern soll
    /*
     * Damit die Daten korrekt in die Simulation übernommen werden können, verwenden Sie bitte die nachfolgende Funktion.
     *      simulation.updatedDeviceValue(device, control_unit, Number(new_value));
     * Diese Funktion verändert gleichzeitig auch den aktuellen Wert des Gerätes, Sie müssen diese daher nur mit den korrekten Werten aufrufen.
     */
     if (!checkToken(req, res)) {
       return;
     }

     var body = req.body;
     if (body === undefined || body === null) {
       res.status(400).json({ success: false, error: "A body with the values you want to edit as a json string must be provided." });
       return;
     }

     var id = body.id;
     if (id === undefined) {
       res.status(400).json({ success: false, error: "The id value must be set in the json body." });
       return;
     }

     var name = body.display_name;
     var control_units = body.control_units;

     if (name === undefined && control_units === undefined) {
       res.status(400).json({ success: false, error: "Either display_name or control_units must be set in the json body." });
       return;
     }

     if (name !== undefined) {
       for (var i = devices.devices.length - 1; i >= 0; i--) {
         if (devices.devices[i].id === id) {
           devices.devices[i].display_name = name;
         }
       }
     }

     if (control_units !== undefined) {
       if (Object.prototype.toString.call(control_units) === '[object Array]') {
         for (var u = 0; u < control_units.length; u++) {
           var cName = control_units[u].name;
           var cCurrent = control_units[u].current;
           if (cName !== undefined && cCurrent !== undefined) {
             for (var d = devices.devices.length - 1; d >= 0; d--) {
               if (devices.devices[d].id === id) {
                 for (var cU = 0; cU < devices.devices[d].control_units.length; cU++) {
                   if (devices.devices[d].control_units[cU].name === cName) {
                     devices.devices[d].control_units[cU].current = cCurrent;
                   }
                 }
               }
             }
           }
         }
       }
     }

     refreshConnected();
     res.json({ success: true });
});

app.post("/devices", function (req, res) {
  "use strict";
  // Adds a device to the list
  if (!checkToken(req, res)) {
    return;
  }

  var body = req.body;
  if (body === undefined || body === null) {
    res.status(400).json({ success: false, error: "The body must be set." });
  }

  var names = ["description", "display_name", "type", "type_name", "image", "image_alt", "control_units"];
  for (var n = 0; n < names.length; n++) {
    if (body[names[n]] === undefined || body[names[n]] === null) {
      var err = "The value " + names[n] + " must be set in the json body.";
      res.status(400).json({ success: false, error: err });
      return;
    }
  }
  if (Object.prototype.toString.call(body.control_units) !== '[object Array]') {
    res.status(400).json({ success: false, error: "The control_units elements must be an array." });
    return;
  }
  for (var b = 0; b < body.control_units.length; b++) {
    if (body.control_units[b].name === undefined || body.control_units[b].name === null) {
      res.status(400).json({ success: false, error: "All control_units elements must have at least a name value" });
      return;
    }
  }

  // Generate an uuid for this device
  body.id = uuid();

  // Add device to devices list
  devices.devices.push(body);

  refreshConnected();
  res.json({ success: true });
});

app.post("/editPassword", function(req, res) {
  "use strict";
  // updates the password
  if (!checkToken(req, res)) {
    return;
  }

  if(req.get("old_password") === undefined || req.get("new_password") === undefined) {
    res.status(403).json({ success: false, error: "old_password and new_password must be set" });
    return;
  }

  if(user.password === req.get("old_password")) {
    user.password = req.get("new_password");
  } else {
    res.status(403).json({ success: false, error: "old_password is wrong" });
    return;
  }

  fs.writeFile("resources/login.config", "username: " + user.email + "\npassword: " + user.password, function (err) {
      if (err) {
        res.status(500).json({ success: false, error: "internal server error", exception: err});
        return console.log(err);
      }

      res.json({success: true});
  });
});

app.delete("/devices/:id", function (req, res) {
  "use strict";
  // Deletes a device if it was provided correctly
  if (!checkToken(req, res)) {
    return;
  }

  var deleted = false;
  var id = req.params.id;
  for (var i = devices.devices.length - 1; i >= 0; i--) {
    if (devices.devices[i].id === id) {
      deleted = true;
      devices.devices.splice(i, 1);
    }
  }
  if (deleted) {
    refreshConnected();
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: "The given device id was not found." });
  }
});

app.ws('/update', function(ws, req) {
  ws.on('message', function(msg) {
    var verified = true;
    try {
      jwt.verify(msg.trim(), pemFile);
      verified = true;
    } catch(err) {
      verified = false;
    }
    if(verified) {
      console.log("verified client");
      verifiedClientIds.push(ws);
    } else {
      console.log("not verified client");
    }
    ws.send(msg);
  });
});

// ******* End Routes *******


var server = app.listen(8081, function () {
    "use strict";
    readUser();
    readDevices();
    readCert();

    var host = server.address().address;
    var port = server.address().port;
    console.log("Big Smart Home Server listening at http://%s:%s", host, port);
});
