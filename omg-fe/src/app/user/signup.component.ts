import { Component, NgModule, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from "src/service/userService";



@Component({ templateUrl: 'signup.component.html' })
export class SignupComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submiited = false;
    
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) {}


    ngOnInit(): void {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    get f() {
        return this.form.controls;
    }

    onSubmit() {
        this.userService.createOne(this.form.value);
    }
}