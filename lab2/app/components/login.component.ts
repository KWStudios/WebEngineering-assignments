import { Component } from '@angular/core';

@Component({
  selector: 'login-component',
  templateUrl: './app/views/login.component.html'
})

export class LoginComponent {
}

function checkInput(username: string, password:string){
  return ((username!=null) && (password!=null));
}
