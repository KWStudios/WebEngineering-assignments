import {Component, OnInit} from "@angular/core";
import {Router} from '@angular/router';
import {RequestOptions, Request, RequestMethod, Headers, Http} from '@angular/http';

@Component({
  moduleId: module.id,
  selector: 'my-sidebar',
  templateUrl: '../views/sidebar.component.html'
})
export class SidebarComponent implements OnInit{

  failed_logins: number = 0;
  server_start: Date = new Date();

  constructor(private router: Router, private http: Http){}

  ngOnInit(): void {
    //TODO Lesen Sie über die REST-Schnittstelle den Status des Servers aus und speichern Sie diesen in obigen Variablen
    var serverStatusOptions = new RequestOptions({
      method: RequestMethod.Get,
      url: 'http://localhost:8081/health_check',
      headers: new Headers({'token': 'Bearer ' + window.localStorage.getItem('jwt_token')}
    )});

    var statusRequest = new Request(serverStatusOptions)

    this.http.request(statusRequest).subscribe(
      resp => {this.failed_logins = resp.json().failed_logins
        this.server_start = resp.json().start_date
      })
}
}
