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
var core_1 = require('@angular/core');
require('rxjs/add/operator/toPromise');
var http_1 = require('@angular/http');
var OptionsComponent = (function () {
    function OptionsComponent(http) {
        this.http = http;
    }
    ;
    OptionsComponent.prototype.ngOnInit = function () {
        this.updateError = false;
    };
    OptionsComponent.prototype.equalsPW = function (form) {
        if (!form || !form.value || !form.value["repeat-password"] || !form.value["new-password"]) {
            return false;
        }
        return form.value["repeat-password"] === form.value["new-password"];
    };
    /**
     * Liest das alte Passwort, das neue Passwort und dessen Wiederholung ein und übertraegt diese an die REST-Schnittstelle
     * @param form
     */
    OptionsComponent.prototype.onSubmit = function (form) {
        var _this = this;
        //✅TODO Lesen Sie Daten aus der Form aus und übertragen Sie diese an Ihre REST-Schnittstelle
        if (!form) {
            return;
        }
        var mheaders = new http_1.Headers({ "Authorization": "Bearer " + window.localStorage.getItem("jwt_token"),
            "new_password": form.value["new-password"],
            "old_password": form.value["old-password"]
        });
        var options = new http_1.RequestOptions({ method: http_1.RequestMethod.Post, url: 'http://localhost:8081/editPassword', headers: mheaders });
        var req = new http_1.Request(options);
        console.log('req.method:', http_1.RequestMethod[req.method]);
        console.log('options.url:', options.url);
        console.log('options.headers:', options.headers);
        console.log('halloggg', this.http.request(req).subscribe(function (res) {
            console.log('response', res.json());
            _this.updateError = false;
        }, function (fail) {
            console.log('failure', fail.json());
            _this.updateError = true;
        }, function () {
            console.log('complete');
            this.updateError = true;
        }));
        form.resetForm();
    };
    OptionsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-options',
            templateUrl: '../views/options.html'
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], OptionsComponent);
    return OptionsComponent;
}());
exports.OptionsComponent = OptionsComponent;
//# sourceMappingURL=options.component.js.map