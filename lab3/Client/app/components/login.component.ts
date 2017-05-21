import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {RequestOptions, Request, RequestMethod, Headers, Http} from '@angular/http';

@Component({
    moduleId: module.id,
    selector: 'my-login',
    templateUrl: '../views/login.html'
})
export class LoginComponent {

    loginError: boolean = false;

    constructor(private router: Router, private http: Http) {
    }

    onSubmit(form: NgForm): void {
        //TODO Überprüfen Sie die Login-Daten über die REST-Schnittstelle und leiten Sie den Benutzer bei Erfolg auf die Overview-Seite weiter

        var mheaders = new Headers({"email": form.value.username, "password": form.value.password});

        var options = new RequestOptions({method: RequestMethod.Post, url: 'http://localhost:8081/login', headers:  mheaders});
        var req = new Request(options);

        this.http.request(req).subscribe(
          res => {  window.localStorage.setItem("jwt_token", res.json().token);
                    this.router.navigate(['/overview']);},
          fail => { this.loginError = true;},
          function(){this.loginError = true;});

    }
}
