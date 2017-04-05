"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var mock_devices_1 = require('../resources/mock-devices');
var core_1 = require('@angular/core');
/**
 * Dieses Service kann verwendet werden um auf die in mock-devices.ts gespeicherten Geräte zuzugreifen
 * Es kann dabei als Provider verwendet und so in der ganzen Applikation eingesetzt werden.
 */
var DeviceService = (function () {
    function DeviceService() {
    }
    /**
     * Liest die gemockten Geräte und liefert diese als Promise zurück
     * @returns {Promise<Device[]>}
     */
    DeviceService.prototype.getDevices = function () {
        return Promise.resolve(mock_devices_1.DEVICES);
    };
    /**
     *
     * Liest die gemockten Geräte und liefert das gewünschte Gerät als Promise zurück
     * @param id zur Identifkation des gewünschten Gerätes
     * @returns {Promise<TResult>}
     */
    DeviceService.prototype.getDevice = function (id) {
        return this.getDevices()
            .then(function (devices) { return devices.find(function (device) { return device.id === id; }); });
    };
    DeviceService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DeviceService);
    return DeviceService;
}());
exports.DeviceService = DeviceService;
//# sourceMappingURL=device.service.js.map