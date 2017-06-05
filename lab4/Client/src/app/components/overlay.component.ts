import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {OverviewComponent} from "./overview.component";
import {DeviceService} from "../services/device.service";
import {Device} from "../model/device";
import {ControlUnit} from "../model/controlUnit";
import {ControlType} from "../model/controlType";
import { Http, RequestOptionsArgs, Headers, URLSearchParams } from '@angular/http';


@Component({
    selector: 'my-overlay',
    templateUrl: '../views/overlay.component.html'
})
export class OverlayComponent implements OnInit {

    @Input()
    overviewComponent: OverviewComponent = null;

    device_types: any;
    controlUnit_types: any;
    selected_type: string = null;
    controlUnitType_selected: string = null;

    addError: boolean = false;
    createError: boolean = false;

    constructor(private deviceService: DeviceService, private http: Http) {
    }


    /**
     * Wird beim Start dieser Componente aufgerufen
     */
    ngOnInit(): void {
        this.device_types = ["Beleuchtung", "Heizkörperthermostat", "Rollladen", "Überwachungskamera", "Webcam"]
        this.controlUnit_types = ["Ein/Auschalter", "Diskrete Werte", "Kontinuierlicher Wert"];
        this.selected_type = this.device_types[0];
        this.controlUnitType_selected = this.controlUnit_types[0];
        this.getSPARQLTypes();
    }

    /**
     * Schließt das Overlay zum Hinzufügen von neuen Geräten
     */
    doClose(): void {
        if (this.overviewComponent != null) {
            this.overviewComponent.closeAddDeviceWindow();
        }
    }


    /**
     * Lies die Formulardaten ein und speichert diese über die REST-Schnittstelle
     * @param form
     */
    onSubmit(form: NgForm): void {

        this.createError = false;


        // Überprüfung ob alle Daten vorhanden
        if (!form || !form.value || !form.value["typename"] || !form.value["displayname"] || !form.value["elementname"]) {
            this.addError = true;
            return;
        }

        if (this.isEnumSelected() && (!form.value["discrete-values"]) || (form.value["discrete-values"] && form.value["discrete-values"].split(",").length == 0)) {
            this.addError = true;
            return;
        }


        var device = new Device();
        device.display_name = form.value["displayname"];
        device.type_name = form.value["typename"];

        // Fügt das dazugehörige Bild, die alternative Bildbeschreibung und die allgemeine Beschreibung zum neuen Gerät hinzu
        switch (this.selected_type) {
            case "Beleuchtung":
                device.image = "images/bulb.svg";
                device.image_alt = "Glühbirne als Indikator für Aktivierung";
                device.description = "Genauere Informationen zu diesem Beleuchtungselement";
                break;
            case "Heizkörperthermostat":
                device.image = "images/thermometer.svg";
                device.image_alt = "Thermometer zur Temperaturanzeige";
                device.description = "Genauere Informationen zu diesem Thermostat";
                break;
            case "Rollladen":
                device.image = "images/roller_shutter.svg";
                device.image_alt = "Rollladenbild als Indikator für Öffnungszustand";
                device.description = "Genauere Informationen zu diesem Rollladen";
                break;
            case "Überwachungskamera":
                device.image = "images/webcam.svg";
                device.image_alt = "Webcam als Indikator für Aktivierung";
                device.description = "Genauere Informationen zu dieser Überwachungskamera";
                break;
            case "Webcam":
                device.image = "images/webcam.svg";
                device.image_alt = "Webcam als Indikator für Aktivierung";
                device.description = "Genauere Informationen zu dieser Webcam";
                break;
            default:
                //TODO Lesen Sie die SPARQL - Informationen aus dem SessionStorage und speichern Sie die entsprechenden Informationen zum Gerät
                break;
        }

        device.type = this.selected_type;

        // Bestimmt welches Steuerungselement für dieses Gerät angezeigt werden soll
        var controlUnit = new ControlUnit();
        controlUnit.primary = true;
        switch (this.controlUnitType_selected) {
            case this.controlUnit_types[0]:
                controlUnit.type = ControlType.boolean;
                break;
            case this.controlUnit_types[1]:
                controlUnit.type = ControlType.enum;
                break;
            case this.controlUnit_types[2]:
                controlUnit.type = ControlType.continuous;
                break;
        }
        controlUnit.name = form.value["elementname"];

        if (this.isContinuousSelected()) {
            controlUnit.min = form.value["minimum-value"];
            controlUnit.max = form.value["maximum-value"];
            controlUnit.current = controlUnit.min;
            controlUnit.values = [""];
        } else {
            controlUnit.min = controlUnit.max = 0;
        }

        if (this.isBooleanSelected()) {
            controlUnit.current = 0;
            controlUnit.values = [""];
        }

        if (this.isEnumSelected()) {
            var values = form.value["discrete-values"].split(",");
            controlUnit.values = [""];
            controlUnit.values.length = 0;
            for (var i = 0; i < values.length; i++) {
                controlUnit.values.push(values[i].trim());
            }
            controlUnit.current = 0;
        }
        device.control_units = [controlUnit];

        // hinzufügen des Gerätes über die REST-Schnittstelle
        this.deviceService.createDevice(device).then(result => {
            if (result) {
                form.reset();
                this.overviewComponent.closeAddDeviceWindow();
            } else {
                this.createError = true;
            }
        });

    }


    getSPARQLTypes(): void {
        /*
        PREFIX cat: <http://dbpedia.org/resource/Category:>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#broader>

    SELECT ?s ?t ?p ?q ?z WHERE {
      ?s ?p cat:Home_automation .
      ?s rdf:type owl:Thing .
      ?s rdfs:label ?t .
      ?q dbo:product ?s .

        */
        //TODO Lesen Sie mittels SPARQL die gewünschten Daten (wie in der Angabe beschrieben) aus und speichern Sie diese im SessionStorage
        this.http.get("http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+cat%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FCategory%3A%3E%0D%0APREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23broader%3E%0D%0A%0D%0ASELECT+%3Fs+%3Ft+%3Fp+%3Fq+%3Fz+WHERE+%7B%0D%0A++%3Fs+%3Fp+cat%3AHome_automation+.%0D%0A++%3Fs+rdf%3Atype+owl%3AThing+.%0D%0A++%3Fs+rdfs%3Alabel+%3Ft+.%0D%0A++%3Fq+dbo%3Aproduct+%3Fs+.%0D%0A++%3Fs+dbo%3Athumbnail+%3Fz%0D%0A++FILTER+%28LANG%28%3Ft%29%3D%27de%27%29%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on)").toPromise().then(res => {
            console.log(res)
            sessionStorage.setItem("sparql", res.toString())

            let usedNames: String[] = []
            let loopArray = res.json().results.bindings
            for (let object in loopArray) {
                let a = JSON.parse(object);
                if (usedNames.some(string => string === a.t.value)) {

                }
            }
        })
    }


    /**
     * Überprüft ob ein bestimmter Gerätetyp bereits ausgewählt ist
     * @param type zu überprüfender Typ
     * @returns {boolean}
     */
    isSelected(type: string): boolean {
        return type == this.device_types[0];
    }

    /**
     * Überprüft ob boolean als Steuerungseinheit gewählt wurde
     * @returns {boolean}
     */
    isBooleanSelected(): boolean {
        return this.controlUnitType_selected === this.controlUnit_types[0];
    }

    /**
     * Überprüft ob enum als Steuerungseinheit gewählt wurde
     * @returns {boolean}
     */
    isEnumSelected(): boolean {
        return this.controlUnitType_selected === this.controlUnit_types[1];
    }

    /**
     * Überprüft ob continuous als Steuerungseinheit gewählt wurde
     * @returns {boolean}
     */
    isContinuousSelected(): boolean {
        return this.controlUnitType_selected === this.controlUnit_types[2];
    }

}
