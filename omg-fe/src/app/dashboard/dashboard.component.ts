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
    systemOrderList!: Session[];
    userList!: User[];

    filteredSessionList: Session[] = [];

    currentTime!: Date;



    menuItems!: MenuItem[];
    adminMenuItems!: MenuItem[];


    hasShowItemForm: boolean = false;
    hasShowSessionForm: boolean = false;

    showFilter: boolean = false;
    showNewUserForm: boolean = false;
    showUsers: boolean = false;
    showItem: boolean = false;
    showSession: boolean = true;
    showTransaction: boolean = false;
    showOrder: boolean = false;
    showSystemOrder: boolean = false;
    showProfile: boolean = false;
    editing: boolean = false;
    profileSubmitButton: boolean = false;
    profileEditButton: boolean = false;

    total: number = 0;
    summary: number = 0;

    profileForm!: FormGroup;
    newUserForm!: FormGroup;

    selectedItem!: Item;
    newItem: any = {
        plateNumber: "",
        id: 0,
        type: '',
        ownershipNumber: '',
        vendor: '',
        status: '',
    };

    currentItem!: Item ;

    role: number = <number>this.userService.getSigninUser()?.role;

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
            label: 'Vật phẩm',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Tạo mới',
                    icon: 'pi pi-fw pi-plus',
                    command: () => this.showItemForm()
                },
                {
                    label: 'Kho đồ',
                    icon: 'pi pi-fw pi-external-link',
                    command: () => this.showMyItem()
                }
            ]
        },
        {
            label: 'Hoá đơn',
            icon: 'pi pi-fw pi-money-bill',
            items: [
                {
                    label: 'Đơn đã thắng',
                    icon: 'pi pi-fw pi-list',
                    command: () => this.showMyOrder()
                },
                {
                    label: 'Phiên đã tham gia',
                    icon: 'pi pi-fw pi-history',
                    command: () => this.showMyTransaction()
                }
            ]
        },
        {
            label: 'Cá nhân',
            icon: 'pi pi-fw pi-user',
            command: () => this.showProfileForm(),
        },
        {
            label: 'Đấu giá',
            icon: 'pi pi-fw pi-calendar',
            items: [
                {
                    label: 'Tạo mới',
                    icon: 'pi pi-fw pi-calendar-plus',
                    command: () => this.showSessionForm()
                },
                {
                    label: 'Theo dõi',
                    icon: 'pi pi-fw pi-calendar',
                    command: () => this.showRunningSession()
                }
            ]
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-fw pi-power-off',
            command: () => this.logOut()
        }
        ]

        this.adminMenuItems = [
            {
            label: 'Vật phẩm',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Tạo mới',
                    icon: 'pi pi-fw pi-plus',
                    command: () => this.showItemForm()
                },
                {
                    label: 'Xem toàn bộ',
                    icon: 'pi pi-fw pi-external-link',
                    command: () => this.showMyItem()
                }
            ]
        },
        {
            label: 'Hoá đơn',
            icon: 'pi pi-fw pi-money-bill',
            items: [
                {
                    label: 'Đơn đã thắng',
                    icon: 'pi pi-fw pi-shopping-cart',
                    command: () => this.showMyOrder()
                },
                {
                    label: 'Phiên đã tham gia',
                    icon: 'pi pi-fw pi-history',
                    command: () => this.showMyTransaction() 
                },
                {
                    label: 'Toàn bộ đơn hàng',
                    icon: 'pi pi-fw pi-list',
                    command: () => this.showSystemOrders() //
                },
                {
                    label: 'Lịch sử đấu giá',
                    icon: 'pi pi-fw pi-history',
                    command: () => this.showMyTransaction() //
                }
            ]
        },
        {
            label: 'Người dùng',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Cá nhân tôi',
                    icon: 'pi pi-fw pi-user',
                    command: () => this.showProfileForm(),
                },
                {
                    label: 'Quản lý',
                    icon: 'pi pi-fw pi-users', // edit user profile
                    command: () => this.manageUser(), 
                },
                {
                    label: 'Thêm mới',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => this.createNewUser()
                }
            ]
            ,
        },
        {
            label: 'Đấu giá',
            icon: 'pi pi-fw pi-calendar',
            items: [
                {
                    label: 'Tạo mới',
                    icon: 'pi pi-fw pi-calendar-plus',
                    command: () => this.showSessionForm()
                },
                {
                    label: 'Theo dõi',
                    icon: 'pi pi-fw pi-calendar',
                    command: () => this.showRunningSession()
                },
                {
                    label: 'Duyệt phiên',
                    icon: 'pi-calendar-times',
                    //
                }
            ]
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-fw pi-power-off',
            command: () => this.logOut()
        }
        ]

        if (this.role == 1) {
            this.itemService.getAllItemByUserId(this.user.id).subscribe((res: any) => {
                this.itemList = res;
                this.currentItem = this.itemList[0];
            });

        } else {
            this.itemService.getAllItems().subscribe((res: any) => {
                this.itemList = res;
                this.currentItem = this.itemList[this.itemList.length - 1]
            })

        }
        this.formGroup = new FormGroup({
            itemSelector: new FormControl<Item> (this.selectedItem)
        })

        setInterval(()=>{
        this.updateTime()
        }, 1000);
    }

    manageUser() {
        this.showUsers = true;
        this.showOrder = false;
        this.showItem = false;
        this.showSession = false;
        this.showTransaction = false;
        this.profileEditButton = false;
        this.profileSubmitButton = false;
        this.showSystemOrder = false;
        this.showProfile = false;
        this.userService.getAllUser().subscribe((res: any) => {
            this.userList = res;
        })

    }

    updateTime() {
        this.currentTime = new Date();
    }

    showItemForm() {
        this.showUsers = false;
        this.showOrder = false;
        this.showItem = false;
        this.showSession = false;
        this.showTransaction = false;
        this.profileEditButton = false;
        this.profileSubmitButton = false;
        this.showSystemOrder = false;
        this.showUsers = false;
        this.hasShowItemForm = true;
        this.showProfile = false;

    }

    showProfileForm() {

        this.showOrder = false;
        this.showItem = false;
        this.showSession = false;
        this.showTransaction = false;
        this.profileEditButton = true;
        this.profileSubmitButton = false;
        this.showSystemOrder = false;
        this.showUsers = false;

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
        this.showSystemOrder = false;
        this.hasShowSessionForm = true;
        this.showUsers = false;
        this.showProfile = false;
        this.showOrder = false;

    }

    requestEditProfile() {
        this.editing = true;
        this.profileSubmitButton = true;
        this.profileEditButton = false;
        this.showSystemOrder = false;
        this.showUsers = false;
        this.showProfile = true;
        this.showOrder = false;

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

    cancelCreateSession() {
        this.hasShowSessionForm = false;
    }

    cancelCreateItem() {
        this.hasShowItemForm = false;
    }

    filterResults(text: string) {
        if (!text) {
            this.filteredSessionList = this.sessionList;
        } 
        this.filteredSessionList = this.sessionList.filter(
            session => session.item.plateNumber.toLowerCase().includes(text.toLowerCase())
        );
    }
    showRunningSession () {
        this.showFilter = true; 

        this.showSystemOrder = false;
        this.showUsers = false;
        this.showProfile = false;
        this.showSession = true;
        this.showItem = false;
        this.showTransaction = false;
        this.showOrder = false;

        this.sessionService.getAllSessions().subscribe((res: any) => {
            this.sessionList = res;
            this.filteredSessionList = this.sessionList;
        })

        this.messageService.add({
            severity: 'info',
            summary: 'Hiển thị các phiên đấu giá!'
        })
    }

    showMyItem() {
        this.showSystemOrder = false;
        this.showUsers = false;
        this.showProfile = false;
        this.showItem = true;
        this.showSession = false;
        this.showTransaction = false;
        this.showOrder = false;

        if (this.role == 1) {
            this.messageService.add({
                severity: 'success',
                summary: 'Hiển thị các vật phẩm của tôi!'
            });
        } else {
            this.messageService.add({
                severity: 'success',
                summary: 'Hiển thị toàn bộ vật phẩm!'
            })
        }
    }

    showMyOrder() {
        this.showItem = false;
        this.showSession = false;
        this.showUsers = false;
        this.showProfile = false;
        this.showTransaction = false;
        this.showOrder = true;
        this.showSystemOrder = false;

        this.sessionService.getAllSessionsByWinnerId(this.user.id).subscribe((res: any) => {
            this.orderList = res;    
        })
        this.messageService.add({
            severity: 'info',
            summary: 'Hiển thị lịch sử thắng đấu giá của tôi!'
        })
    }

    showSystemOrders () {
        this.showItem = false;
        this.showSession = false;
        this.showTransaction = false;
        this.showUsers = false;
        this.showProfile = false;
        this.showSystemOrder = true;

        this.sessionService.getOrder().subscribe((res: any) => {
            //console.log(res);
            this.systemOrderList = res;
    
        })
        this.messageService.add({
            severity: 'info',
            summary: 'Hiển thị lịch sử thắng đấu giá của mọi người!'
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
        this.showSystemOrder = false;
        this.showUsers = false;
        this.showProfile = false;
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
                        detail: 'Thông tin của ' + this.f['name'].value + ' đã được lưu lại!'
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
        this.showUsers = false;
        this.showOrder = false;

    }

    get f() {
        return this.profileForm.controls;
    }

    get userForm() {
        return this.newUserForm.controls;
    }

    createNewUser() {
        this.showNewUserForm = true;
        this.showItem = false;
        this.showSession = false;
        this.showTransaction = false;
        this.showOrder = false;
        this.showSystemOrder = false;
        this.showUsers = false;

        this.newUserForm = this.formBuilder.group({
            name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onCancelCreateUser() {
        this.showNewUserForm = false;
    }

    onSubmitCreateUser() {
        if (this.userForm['username'].value == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Tên người dùng không được để trống!'
            });
            return;
        } 
        if (this.userForm['name'].value == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Tên không được để trống!'
            });
            return;
        }

        if (this.userForm['email'].value == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Email không được để trống!'
            });
            return;
        }

        if (!this.isEmail(this.userForm['email'].value)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Email không hợp lệ!'
            });
            return;
        }

        if (this.userForm['password'].value == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Mật khẩu không được để trống!'
            });
            return;
        }

        if (this.newUserForm.invalid) {
            return;
        }
    
        this.userService.createOne(this.newUserForm.value).subscribe(
            (user: User) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Đăng ký thành công!',
                    detail: 'Người dùng mới: ' + user.name
                });
                this.showNewUserForm = false;
                window.location.reload();
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
