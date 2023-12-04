import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignupComponent } from './user/signup.component';
import { SigninComponent } from './user/signin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';

const routes: Routes = [
  {
    path: '', component: HomePageComponent
  },
  {
    path: 'signup', component: SignupComponent
  },
  {
    path: 'signin', component: SigninComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: 'room/:sessionId', component: SessionDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
