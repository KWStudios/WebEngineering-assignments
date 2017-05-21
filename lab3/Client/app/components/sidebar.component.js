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
var core_1 = require("@angular/core");
var router_1 = require('@angular/router');
var http_1 = require('@angular/http');
var SidebarComponent = (function () {
    function SidebarComponent(router, http) {
        this.router = router;
        this.http = http;
        this.failed_logins = 0;
        this.server_start = new Date();
    }
    SidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        //TODO Lesen Sie über die REST-Schnittstelle den Status des Servers aus und speichern Sie diesen in obigen Variablen
        var serverStatusOptions = new http_1.RequestOptions({
            method: http_1.RequestMethod.Get,
            url: 'http://localhost:8081/health_check',
            headers: new http_1.Headers({ 'token': 'Bearer ' + window.localStorage.getItem('jwt_token') }) });
        var statusRequest = new http_1.Request(serverStatusOptions);
        this.http.request(statusRequest).subscribe(function (resp) {
            _this.failed_logins = resp.json().failed_logins;
            _this.server_start = resp.json().start_date;
        });
    };
    SidebarComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-sidebar',
            templateUrl: '../views/sidebar.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, http_1.Http])
    ], SidebarComponent);
    return SidebarComponent;
}());
exports.SidebarComponent = SidebarComponent;
//# sourceMappingURL=sidebar.component.js.map