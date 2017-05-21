import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {OverviewComponent} from "./overview.component";
import {DeviceService} from "../services/device.service";
import {Device} from "../model/device";
import {ControlUnit} from "../model/controlUnit";
import {ControlType} from "../model/controlType";
import {RequestOptions, Request, RequestMethod, Headers, Http} from '@angular/http';

@Component({
  moduleId: module.id,
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


  ngOnInit(): void {
    this.device_types = ["Beleuchtung", "Heizkörperthermostat", "Rollladen", "Überwachungskamera", "Webcam"]
    this.controlUnit_types = ["Ein/Auschalter", "Diskrete Werte", "Kontinuierlicher Wert"];
    this.selected_type = this.device_types[0];
    this.controlUnitType_selected = this.controlUnit_types[0];
  }

  doClose(): void {
    if (this.overviewComponent != null) {
      this.overviewComponent.closeAddDeviceWindow();
    }
  }

  /**
   * Liest die Daten des neuen Gerätes aus der Form aus und leitet diese an die REST-Schnittstelle weiter
   * @param form
   */
  onSubmit(form: NgForm): void {
    console.log(form.value)
    var addDeviceOptions = new RequestOptions({
      method: RequestMethod.Post,
      url: 'http://localhost:8081/devices',
      headers: new Headers({'Authorization': 'Bearer ' + window.localStorage.getItem('jwt_token'),
      'Content-Type': 'application/json',
      body: {
        "description": "Genauere Informationen zu diesem Gerät",
        "display_name": form.value.displayname,
        "type": form.value["type-input"],
        "type_name": form.value.typename,
        "control_units": [
        {
          "name": form.value.elementname,
          "type": form.value["elementtype-input"],
          "min": form.value["minimum-value"],
          "max": form.value["maximum-value"],
          "primary": true,
        }
      ]
      }
    })});
    var addDeviceRequest = new Request(addDeviceOptions)
    this.http.request(addDeviceRequest).subscribe(
      res => {},
      fail => {}
    )



    form.reset();
    this.overviewComponent.closeAddDeviceWindow();

    //TODO Lesen Sie Daten aus der Form aus und übertragen Sie diese an Ihre REST-Schnittstelle

  }

  isSelected(type: string): boolean {
    return type == this.device_types[0];
  }

  isBooleanSelected(): boolean {
    return this.controlUnitType_selected === this.controlUnit_types[0];
  }

  isEnumSelected(): boolean {
    return this.controlUnitType_selected === this.controlUnit_types[1];
  }

  isContinuousSelected(): boolean {
    return this.controlUnitType_selected === this.controlUnit_types[2];
  }

}
