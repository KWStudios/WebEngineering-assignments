import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Observer} from "rxjs/Observer";

@Component({
  moduleId: module.id,
  selector: 'my-overview',
  templateUrl: '../views/overview.html'
})
export class OverviewComponent {

  constructor() {
    console.log('overview', 'started');

    var ws = new WebSocket('ws://127.0.0.1:8081/update');

    ws.onopen = function() {
      ws.send(window.localStorage.getItem("jwt_token"));
    };
    ws.onmessage = function(evt) { console.log('message', 'received'); };
    ws.onclose = function(){};

  }

  isAddDevice: boolean = false;

  addDevice() {
    this.isAddDevice = true;
  }

  closeAddDeviceWindow(){
    this.isAddDevice = false;
  }
}
