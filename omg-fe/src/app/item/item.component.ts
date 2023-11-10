import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { Item } from './item';
import { ItemService } from '../../service/itemService';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemComponent),  // replace name as appropriate
      multi: true
    }
  ]
})
export class ItemComponent implements OnInit{
  @Input() itemId!: number;
  form!: FormGroup;
  likeCounter!: number;
  public item!: Item;
  buttonDisabled: boolean = false;
  editButtonDisabled: boolean = true;
  plateNumber!: string;
  sessionDuration!: any;
  vendor!: string | null;
  type!: string;
  editing: boolean = false;
  status!: string;
  startButtonDisabled: boolean = true;
  ownershipNumber!: string;

  ownerName!: string;
  constructor(
    private itemService: ItemService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) {}

  ngOnInit(): void {
    this.itemService.getOne(this.itemId).subscribe((res: any) => {

      this.item = res;
      this.plateNumber = this.item.plateNumber;
      this.vendor = this.item.vendor;
      this.type = this.item.type;
      this.status = this.item.status;
      this.ownershipNumber = this.item.ownershipNumber;
      if (this.item.owner) {
        this.ownerName = this.item.owner.name;
      } else {
        this.ownerName =  'Chưa rõ'
      }

      if (this.status == 'available') {
        this.editButtonDisabled = false;
        this.startButtonDisabled = false;
      }
      //this.closeTime = new Date (this.item.time);
    });

    
  }

  likeButtonClicked() {
    this.likeCounter += 1;
  }

  editButtonClicked() {
    this.editing = true;
    this.form = this.formBuilder.group({
      plateNumber: [this.plateNumber, Validators.required],
      vendor: [this.vendor, Validators.required],
      type: [this.type, Validators.required],
      id: [this.itemId]
    })
  }

  get f() {
    return this.form.controls;
  }

  cancelButtonClicked() {
    if (this.buttonDisabled == true) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
  }

  saveButtonClicked() {
    //this.item.likes = this.likeCounter;
    this.itemService.saveOne(this.item).subscribe((res: any) => {
      this.likeCounter = res.likes;
      console.log(res.likes);
    });
  } 

  updateLikes(newLikes: number) {
    this.likeCounter = newLikes;
  }

  onSubmit() {
    if (this.f['plateNumber'].value == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Vui lòng kiểm tra lại!',
        detail: 'Biển số xe không được để trống!'
      })
      return;
    }

    if (this.f['vendor'].value == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Vui lòng kiểm tra lại!',
        detail: 'Hãng xe không được để trống!'
      })
      return;
    }

    if (this.f['type'].value == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Vui lòng kiểm tra lại!',
        detail: 'Loại xe không được để trống!'
      })
      return;
    }

    if (this.f['plateNumber'].value == this.plateNumber 
    && this.f['vendor'].value == this.vendor
    && this.f['type'].value == this.type) {
      this.messageService.add({
        severity: 'error',
        summary: 'Vui lòng kiểm tra lại!',
        detail: 'Không có gì thay đổi!'
      })
      return;
    }

  

    this.itemService.saveOne(this.form.value).subscribe(
      (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cập nhật thành công!',
          detail: this.f['plateNumber'].value + '\n' 
          + this.f['vendor'].value + '\n'
          + this.f['type'].value 
        });
        this.editing = false;
        this.vendor = this.f['vendor'].value;
        this.plateNumber = this.f['plateNumber'].value;
        this.type = this.f['type'].value;
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

  onCancel() {
    this.editing = false;
  }

  startButtonClicked() {
    
  }
}
