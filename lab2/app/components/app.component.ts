import { Component } from '@angular/core';

import { HeaderComponent } from './header.component'
import { FooterComponent } from './footer.component'

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `
  <my-header></my-header>
  <router-outlet></router-outlet>
  <my-footer></my-footer>
  `
})
export class AppComponent {
}
