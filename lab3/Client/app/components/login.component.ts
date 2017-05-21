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
        console.log('req.method:', RequestMethod[req.method]);
        console.log('options.url:', options.url);
        console.log('options.headers:', options.headers);

        console.log('halloggg', this.http.request(req).subscribe(
          res => {  console.log('response', res.json());
                    window.localStorage.setItem("jwt_token", res.json().token);
                    console.log('jwt_token', window.localStorage.getItem("jwt_token"));
                    this.router.navigate(['/overview']);},
          fail => { console.log('failure', fail.json());
                    this.loginError = true;},
          function(){ console.log('complete');
                    this.loginError = true;}));

    }
}
