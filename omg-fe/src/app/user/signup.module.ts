import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { RouterModule } from '@angular/router';
import { SigninComponent } from './signin.component';
@NgModule({
    imports: [
        RouterModule,
      FormsModule,    //added here too
      ReactiveFormsModule //added here too
    ],
    declarations: [SignupComponent],
    providers: [],
    bootstrap: [SignupComponent]
  })
export class SignupModule {
    
}