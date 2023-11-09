import { Component, NgModule, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, first, throwError } from "rxjs";
import { UserService } from "src/service/userService";
import { User } from "./user";
import { MessageService } from "primeng/api";



@Component({ templateUrl: 'signup.component.html' })
export class SignupComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submiited = false;
    
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private messageService: MessageService
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
        console.log(this.f['username'].value);
        if (this.f['username'].value == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Tên người dùng không được để trống!'
            });
            return;
        } 
        if (this.f['name'].value == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Tên không được để trống!'
            });
            return;
        }

        if (this.f['email'].value == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Email không được để trống!'
            });
            return;
        }

        if (!this.isEmail(this.f['email'].value)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Email không hợp lệ!'
            });
            return;
        }

        if (this.f['password'].value == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Mật khẩu không được để trống!'
            });
            return;
        }

        if (this.form.invalid) {
            return;
        }
    
        this.userService.createOne(this.form.value).subscribe(
            (user: User) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Đăng ký thành công!',
                    detail: 'Người dùng mới: ' + user.name
                });
                this.router.navigate(['/signin'])
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: error.error.message,
                    detail: 'Vui lòng kiểm tra lại!'
                })
            }
        );
    }

    isEmail(search:string):boolean
    {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        const email: string = search;
        const result: boolean = expression.test(email);
        return result
    }
}