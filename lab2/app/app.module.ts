import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module'

import { AppComponent }         from './components/app.component';
import { LoginComponent }       from './components/login.component'
import { OptionsComponent }       from './components/options.component'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ChartsModule,
    AppRoutingModule
  ],

  declarations: [
    AppComponent,
    LoginComponent,
    OptionsComponent
  ],

  bootstrap: [ AppComponent ]
})
export class AppModule { }
