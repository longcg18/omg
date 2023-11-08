import { NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemComponent } from './item/item.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SessionComponent } from './session/session.component';
import { DropdownModule } from 'primeng/dropdown';
import { UserComponent } from './user/user.component';
import { SignupModule } from './user/signup.module';
import { RouterModule } from '@angular/router';
import { SigninModule } from './user/signin.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { TransactionComponent } from './transaction/transaction.component';
import { TableModule } from 'primeng/table';
import { OrderComponent } from './order/order.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    DashboardComponent,
    SessionComponent,
    UserComponent,
    TransactionComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    CardModule,
    MenuModule,
    MenubarModule,
    ButtonModule,
    CalendarModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    DropdownModule,
    ReactiveFormsModule,
    SignupModule,
    SigninModule,
    SocketIoModule.forRoot(config),
    SigninModule,
    SignupModule,
    TableModule
  ],
  providers: [JwtHelperService, {
    provide: JWT_OPTIONS,
    useValue: JWT_OPTIONS
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
