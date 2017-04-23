import { Component } from '@angular/core';

import { HeaderComponent } from './header.component'
import { FooterComponent } from './footer.component'

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `
  <header></header>
  <router-outlet></router-outlet>
  <footer></footer>
  `
})
export class AppComponent {
}
