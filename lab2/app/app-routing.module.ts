
import { NgModule }      from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }       from './components/login.component';
import { OverviewComponent }    from './components/overview.component';
import { OptionsComponent }       from './components/options.component';
import { DetailsComponent }       from './components/details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'overview',
    component: OverviewComponent
  },
  {
    path: 'options',
    component: OptionsComponent
  },
  {
    path: 'details',
    component: DetailsComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule{}
