
import { Component } from '@angular/core'

import { Router } from '@angular/router';

@Component({
  selector:'my-header',
  templateUrl: '../app/views/header.component.html'
})

export class HeaderComponent {
  constructor(private router:Router) {
    console.log(router.url);
  }
}
