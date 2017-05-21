import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {NgForm} from '@angular/forms';
import {RequestOptions, Request, RequestMethod, Headers, Http} from '@angular/http';


@Component({
    moduleId: module.id,
    selector: 'my-options',
    templateUrl: '../views/options.html'
})
export class OptionsComponent implements OnInit {

    updateError: boolean;

    constructor(private http: Http) {
    };

    ngOnInit(): void {
        this.updateError = false;
    }

    public equalsPW(form: NgForm): boolean {
        if (!form || !form.value || !form.value["repeat-password"] || !form.value["new-password"]) {
            return false;
        }
        return form.value["repeat-password"] === form.value["new-password"];
    }


    /**
     * Liest das alte Passwort, das neue Passwort und dessen Wiederholung ein und übertraegt diese an die REST-Schnittstelle
     * @param form
     */
    onSubmit(form: NgForm): void {

        //TODO Lesen Sie Daten aus der Form aus und übertragen Sie diese an Ihre REST-Schnittstelle
        if (!form) {
            return;
        }

        var mheaders = new Headers({"Authorization" : "Bearer " + window.localStorage.getItem("jwt_token"),
          "new_password": form.value["new-password"],
          "old_password": form.value["old-password"]
        });

        var options = new RequestOptions({method: RequestMethod.Post, url: 'http://localhost:8081/editPassword', headers:  mheaders});
        var req = new Request(options);

        this.http.request(req).subscribe(
          res => {  this.updateError = false;},
          fail => { this.updateError = true;},
          function(){this.updateError = true;});

        form.resetForm();

    }

}
