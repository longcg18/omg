import { Component, OnInit, forwardRef } from '@angular/core';
import { Item } from '../item/item';
import { ItemService } from '../../service/itemService';
import { MenuItem } from 'primeng/api';
import { Session } from '../session/session';
import { SessionService } from 'src/service/sessionService';
import { FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { UserService } from 'src/service/userService';
import { User } from '../user/user';
import { DOCUMENT } from '@angular/common';
import { TransactionService } from 'src/service/transactionService';
import { Transaction } from '../transaction/transaction';
import { OrderService } from 'src/service/orderService';
import { Order } from '../order/order';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DashboardComponent),  // replace name as appropriate
      multi: true
    }
  ]
})
export class DashboardComponent implements OnInit {
  itemList!: Item[]; 
  sessionList!: Session[];
  transactionList!: Transaction[];
  orderList!: Session[];

  currentTime!: Date;
  menuItems!: MenuItem[];

  hasShowItemForm: boolean = false;
  hasShowSessionForm: boolean = false;

  showItem: boolean = false;
  showSession: boolean = true;
  showTransaction: boolean = false;
  showOrder: boolean = false;
  showProfile: boolean = false;
  editing: boolean = false;
  profileSubmitButton: boolean = false;
  profileEditButton: boolean = false;

  total: number = 0;
  summary: number = 0;
  profileForm!: FormGroup;

  selectedItem!: Item;
  newItem: Item = {
      plateNumber: "",
      id: 0,
      type: '',
      ownershipNumber: '',
      vendor: '',
      status: ''
  };

  currentItem!: Item ;

  user: any = this.userService.getSigninUser();

  itemIdPicker!: number;

  newSession: any = {
      id: 0,
      startTime: '',
      closeTime: '',
      initiatePrice: 0,
      reversePrice: 0,
      stepPrice: 0,
      currentPrice: 0,
      item: this.currentItem,
  }

  formGroup!: FormGroup;

  constructor(
    private itemService: ItemService, 
    private sessionService: SessionService, 
    public userService: UserService,
    private transactionService: TransactionService,
    public messageService: MessageService,
    private formBuilder: FormBuilder
    ) {
  }



  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Item',
        icon: 'pi pi-fw pi-file',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-plus',
                command: () => this.showItemForm()
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash'
            },
            {
                separator: true
            },
            {
                label: 'View my items',
                icon: 'pi pi-fw pi-external-link',
                command: () => this.showMyItem()
            }
        ]
    },
    {
        label: 'Order',
        icon: 'pi pi-fw pi-money-bill',
        items: [
            {
                label: 'My orders',
                icon: 'pi pi-fw pi-list',
                command: () => this.showMyOrder()
            },
            {
                label: 'History',
                icon: 'pi pi-fw pi-history',
                command: () => this.showMyTransaction()
            },
            {
                label: 'Center',
                icon: 'pi pi-fw pi-align-center'
            },
            {
                label: 'Justify',
                icon: 'pi pi-fw pi-align-justify'
            }
        ]
    },
    {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-user-plus'
            },
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                command: () => this.showProfileForm()
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Filter',
                        icon: 'pi pi-fw pi-filter',
                        items: [
                            {
                                label: 'Print',
                                icon: 'pi pi-fw pi-print'
                            }
                        ]
                    },
                    {
                        icon: 'pi pi-fw pi-bars',
                        label: 'List'
                    }
                ]
            }
        ]
    },
    {
        label: 'Sessions',
        icon: 'pi pi-fw pi-calendar',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-calendar-plus',
                command: () => this.showSessionForm()
            },
            {
                label: 'Archieve',
                icon: 'pi pi-fw pi-calendar-times',
                items: [
                    {
                        label: 'Remove',
                        icon: 'pi pi-fw pi-calendar-minus'
                    }
                ]
            },
            {
                label: 'Show',
                icon: 'pi pi-fw pi-calendar',
                command: () => this.showRunningSession()
            }
        ]
    },
    {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.logOut()
    }
    ]

    this.sessionService.getAllSessions().subscribe((res: any) => {
        this.messageService.add({
            severity: 'info',
            summary: 'Hiển thị các phiên đấu giá!'
        })
        this.sessionList = res;
    })

    this.itemService.getAllItemByUserId(this.user.id).subscribe((res: any) => {

       this.itemList = res;
       this.currentItem = this.itemList[0];

    })

    this.formGroup = new FormGroup({
        itemSelector: new FormControl<Item> (this.selectedItem)
        
    })

    setInterval(()=>{
      this.updateTime()
    }, 1000);
  }

  updateTime() {
    this.currentTime = new Date();
  }

  showItemForm() {
    this.hasShowItemForm = true;
  }

  showProfileForm() {

    this.showOrder = false;
    this.showItem = false;
    this.showSession = false;
    this.showTransaction = false;
    this.profileEditButton = true;
    this.profileSubmitButton = false;
    var dob = new Date(this.user.birthday).getDay()

    this.profileForm = this.formBuilder.group({
        name: [this.user.name, Validators.required],
        address: [this.user.address, Validators.required],
        birthday: [this.user.birthday, Validators.required],
        phone: [this.user.phone, Validators.required]
    })
    this.showProfile = true;

  }

  showSessionForm() {
    this.hasShowSessionForm = true;
  }

  requestEditProfile() {
    this.editing = true;
    this.profileSubmitButton = true;
    this.profileEditButton = false;
    
  }

  createItem() {
    this.itemService.createOne(this.newItem, this.user);
    window.location.reload();
    this.messageService.add({
        severity: 'success',
        summary: 'Tạo vật phẩm mới!'
    })
  }

  logOut() {
    this.userService.logout();
    this.messageService.add({
        severity: 'info',
        summary: 'Đã đăng xuất!'
    })
  }

  createSession() {
    var newSession: any = {
        id: 0,
        startTime: this.newSession.startTime,
        closeTime: this.newSession.closeTime,
        initiatePrice: this.newSession.initiatePrice,
        reversePrice: this.newSession.reversePrice,
        stepPrice: this.newSession.stepPrice,
        currentPrice: this.newSession.initiatePrice,
        item: this.formGroup.get('itemSelector')?.value,
    }
    this.sessionService.createOne(newSession);
    newSession.item.status = "not_available";
    this.itemService.saveOne(newSession.item).subscribe();
    window.location.reload();
    this.messageService.add({
        severity: 'success',
        summary: 'Tạo phiên đấu giá mới!'
    })
  }

  showRunningSession () {
    this.showSession = true;
    this.showItem = false;
    this.showTransaction = false;
    this.showOrder = false;
    this.messageService.add({
        severity: 'info',
        summary: 'Hiển thị các phiên đấu giá!'
    })
  }

  showMyItem() {
    this.showItem = true;
    this.showSession = false;
    this.showTransaction = false;
    this.showOrder = false;
    this.messageService.add({
        severity: 'success',
        summary: 'Hiển thị các vật phẩm của tôi!'
    })
  }

  showMyOrder() {
    this.showItem = false;
    this.showSession = false;
    this.showTransaction = false;
    this.showOrder = true;
    this.sessionService.getAllSessionsByWinnerId(this.user.id).subscribe((res: any) => {
        this.orderList = res;
        console.log(this.orderList);

    })
    this.messageService.add({
        severity: 'info',
        summary: 'Hiển thị lịch sử thắng đấu giá!'
    })
  }
  showMyTransaction() {
    this.summary = 0;
    this.transactionService.getAllTransaction(this.user.id).subscribe((res: any) => {
        this.transactionList = res;
        this.transactionList.forEach((i) => {
            i.created_at = new Date(i.created_at);
        })
        for (let i of this.transactionList) {
            this.summary += i.money;
        }
    });

    this.showOrder = false;
    this.showItem = false;
    this.showSession = false;
    this.showTransaction = true;
    this.messageService.add({
        severity: 'info',
        summary: 'Hiển thị lịch sử đặt giá!'
    })
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
                    detail: 'Thông tin của ' + this.f['name'] + ' đã được lưu lại!'
                });
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
    this.showProfile = false;
    this.editing = false;
  }

  get f() {
    return this.profileForm.controls;
  }

}
