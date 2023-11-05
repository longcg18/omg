import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { RouterModule } from '@angular/router';
import { SigninComponent } from './signin.component';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [
        RouterModule,
        FormsModule,    //added here too
        ReactiveFormsModule, //added here too,
        CommonModule
    ],
    declarations: [SigninComponent],
    providers: [],
    bootstrap: [SigninComponent]
  })
export class SigninModule {
    
}