import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { RouterModule } from '@angular/router';
import { SigninComponent } from './signin.component';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        RouterModule,
        InputTextModule,
        ButtonModule,
      FormsModule,    //added here too
      ReactiveFormsModule //added here too
    ],
    declarations: [SignupComponent],
    providers: [],
    bootstrap: [SignupComponent]
  })
export class SignupModule {
    
}