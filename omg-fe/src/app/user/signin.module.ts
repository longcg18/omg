import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { RouterModule } from '@angular/router';
import { SigninComponent } from './signin.component';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
@NgModule({
    imports: [
        RouterModule,
        InputTextModule,
        ButtonModule,
        FormsModule,    //added here too
        ReactiveFormsModule, //added here too,
        CommonModule,
        ToastModule,
        CheckboxModule,
        CardModule
    ],
    declarations: [SigninComponent],
    providers: [],
    bootstrap: [SigninComponent]
  })
export class SigninModule {
    
}