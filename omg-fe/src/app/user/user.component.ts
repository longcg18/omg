import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/service/userService';
import { User } from './user';
import { MessageService } from 'primeng/api';
import { Item } from '../item/item';
import { Session } from '../session/session';
import { Transaction } from '../transaction/transaction';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() userId!: number;

  form!: FormGroup;

  user!: User;
  
  username!: string;
  password!: string;
  
  name!: string;
  email!: string;
  address!: string;
  birthday!: Date;
  phone!: string;

  birthdayDisplay!: string;

  role!: number;
  items!: Item[];
  transaction!: Transaction[];
  session!: Session[];


  startButtonDisabled: boolean = false;
  editButtonDisabled: boolean = false;
  editing: boolean = false;
  profileEditButton!: boolean;
  profileSubmitButton!: boolean;

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private messageService: MessageService) {

  }

  ngOnInit(): void {
    this.userService.getOne(this.userId).subscribe((res: any) => {
      this.user = res;

      this.username = this.user.username;
      this.password = this.user.password;
      this.name = this.user.name;
      this.email = this.user.email;
      this.birthday = this.user.birthday;
      this.address = this.user.address;
      this.phone = this.user.phone;

      this.role = this.user.role;
      this.items = this.user.items;
      this.transaction = this.user.transaction;
      this.session = this.user.session;

      if (this.birthday != null) {
        this.birthdayDisplay = this.getBirthday(this.birthday);
      } else {
        this.birthdayDisplay = "Chưa rõ"
      }
    })
  }

  startButtonClicked() {

  }


  editButtonClicked() {
    this.editButtonDisabled = true;
    this.startButtonDisabled = true;
    this.editing = true;
    this.form = this.formBuilder.group({
      name: [this.name, Validators.required],
      address: [this.address, Validators.required],
      phone: [this.phone, Validators.required],
      birthday: [this.birthday, Validators.required],
      id: [this.userId]
    })
  }

  get f() {
    return this.form.controls;
}

  onSubmitProfile() {
    this.editing = true;
    if (this.f['phone'].value == this.user.phone &&
    this.f['name'].value == this.user.name &&
    this.f['birthday'].value == this.user.birthday &&
    this.f['address'].value == this.user.address) {
      this.messageService.add({
          severity: 'error',
          summary: 'Vui lòng kiểm tra lại!',
          detail: 'Không có gì thay đổi!'
      })
      return;
    } else {
        this.user.phone = this.f['phone'].value;
        this.user.name = this.f['name'].value;
        this.user.birthday = this.f['birthday'].value;
        this.user.address = this.f['address'].value;

        this.userService.updateProfile(this.user).subscribe(
            (res: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Cập nhật thành công!',
                    detail: 'Thông tin của ' + this.f['name'].value + ' đã được lưu lại!'
                });
                this.name = this.f['name'].value;
                this.phone =  this.f['phone'].value;
                this.birthday =  new Date(this.f['birthday'].value);
                this.address = this.f['address'].value;

                if (this.birthday!=null) {
                  this.birthdayDisplay = this.getBirthday(this.birthday);
                } else {
                  this.birthdayDisplay = "Chưa rõ"
                }

                this.editing = false;
                this.profileEditButton = true;
                this.profileSubmitButton = false;
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: error.error.message,
                    detail: 'Vui lòng kiểm tra lại!'
                })
            }
            
        )
      }
  }

  onCancelProfile() {
    this.editing = false;

  }

  getBirthday(date: Date): string {
    date = new Date(date);
    // return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // month start with 0
    const day = date.getDate();
    return day + '/'+ month + '/' + year; 
  }
}
