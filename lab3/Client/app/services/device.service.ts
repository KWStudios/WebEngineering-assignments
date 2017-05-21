import {Device} from '../model/device';
import {Injectable} from '@angular/core';

import {DEVICES} from '../resources/mock-device';
import {DeviceParserService} from './device-parser.service';

import 'rxjs/add/operator/toPromise';

import {RequestOptions, Request, RequestMethod, Headers, Http} from '@angular/http';


@Injectable()
export class DeviceService {

    constructor(private parserService: DeviceParserService, private http: Http) {
    }

    //TODO Sie können dieses Service benutzen, um alle REST-Funktionen für die Smart-Devices zu implementieren

    getDevices(): Promise<Device[]> {
        //TODO Lesen Sie die Geräte über die REST-Schnittstelle aus
        /*
         * Verwenden Sie das DeviceParserService um die via REST ausgelesenen Geräte umzuwandeln.
         * Das Service ist dabei bereits vollständig implementiert und kann wie unten demonstriert eingesetzt werden.
         */
         var httt = this.http;
        var promise = new Promise<Device[]>(function(resolve, reject) {
          var Devices: Device[];
          var getDeviceOptions = new RequestOptions({
                  method: RequestMethod.Get,
                  url: 'http://localhost:8081/devices',
                  headers: new Headers({'Authorization': 'Bearer ' + window.localStorage.getItem('jwt_token')}
          )});

          var getDeviceRequest = new Request(getDeviceOptions);
          httt.request(getDeviceRequest).subscribe(res => {
                Devices = res.json().devices;
                resolve(Devices);
            });
        });

        promise.then(devices => {
          for (let i = 0; i < devices.length; i++) {
            devices[i] = this.parserService.parseDevice(devices[i]);
          }
          return devices;
        });


         return promise;
    }

    getDevice(id: string): Promise<Device> {
        return this.getDevices()
            .then(devices => devices.find(device => device.id === id));
    }

}
