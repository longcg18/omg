import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from 'src/service/userService';
import { MessageService } from 'primeng/api';


@Component({ templateUrl: 'Signin.component.html' })
export class SigninComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }


    onSubmit() {
        this.submitted = true;
    
        // reset alerts on submit
        // stop here if form is invalid

        if (this.f['username'].value == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Tên người dùng không được để trống!'
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
    
        this.loading = true;
        this.userService.login(this.f['username'].value, this.f['password'].value)
            .pipe(first())
            .subscribe(
                () => {
                    // get return url from query parameters or default to home page
                    const returnUrl = this.route.snapshot.queryParams['home'] || '/';
                    this.router.navigateByUrl(returnUrl);
                },
                (error) => {
                    // Xử lý khi có lỗi trong quá trình đăng nhập
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Sai thông tin đăng nhập!',
                        detail: error.error.error
                    });
                    //console.error('Lỗi khi đăng nhập:', error.error);
                }
            );
    }
}