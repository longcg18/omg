import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
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
import { FileUpload } from 'primeng/fileupload';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
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
    uploadedFiles: any[] = [];
    itemList!: Item[]; 
    sessionList!: Session[];
    transactionList!: Transaction[];
    orderList!: Session[];
    systemOrderList!: Session[];
    userList!: User[];
    image!: File;

    //@ViewChild('itemImage') itemImage!: File;

    filteredSessionList: Session[] = [];

    currentTime!: Date;
    menuItems!: MenuItem[];
    adminMenuItems!: MenuItem[];

    currentDashboard: string | null = null;

    total: number = 0;
    summary: number = 0;
    previewUrl: string | null = null;
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
        this.currentDashboard = 'userManagement';
        this.userService.getAllUser().subscribe((res: any) => {
            this.userList = res;
        })

    }

    previewImage(file: File): void {
        const reader = new FileReader();
      
        reader.onload = (e: any) => {
          this.previewUrl = e.target.result;
        };
      
        reader.readAsDataURL(file);
      }

    onChangeFile(event: any) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                this.previewUrl = e.target.result;
            };

            reader.readAsDataURL(file);
        }
        this.image = event.target.files[0];
    }

    updateTime() {
        this.currentTime = new Date();
    }

    showItemForm() {
        this.currentDashboard = 'createItem';
    }

    showProfileForm() {
        this.currentDashboard = 'myProfile';
    }

    showSessionForm() {
        this.currentDashboard = 'createSession';
    }

    createItem() {
        if (!this.image) {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Phải tải lên ít nhất một ảnh!'
              })
            return;
        }

        if (this.newItem.plateNumber == '') {
            this.messageService.add({
              severity: 'error',
              summary: 'Vui lòng kiểm tra lại!',
              detail: 'Biển số xe không được để trống!'
            })
            return;
        }
    
        if (this.newItem.vendor == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Vui lòng kiểm tra lại!',
                detail: 'Nhãn hiệu không được để trống!'
            })
        return;
        }
      
        if (this.newItem.type == '') {
            this.messageService.add({
              severity: 'error',
              summary: 'Vui lòng kiểm tra lại!',
              detail: 'Loại xe không được để trống!'
            })
            return;
        }

        let formData = new FormData();

        //formData.append('image', this.itemImage);
        console.log(this.image);
        formData.append('plateNumber', this.newItem.plateNumber);
        formData.append('vendor', this.newItem.vendor);
        formData.append('type', this.newItem.type);
        formData.append('image', this.image, this.image.name);
        formData.append('imageName', this.image.name);

        // console.log(this.newItem);
        // this.newItem.images = this.uploadedFiles;
        
        console.log(formData);
        this.itemService.createOne(formData, this.user);
        window.location.reload();
        this.messageService.add({
            severity: 'success',
            summary: 'Tạo vật phẩm mới!'
        })
    }

    imageOnSelect(event: any) {
        this.image = event.target;
        console.log(this.image);
    }

    imageOnUpload(event: any) {
        console.log(event.files);

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
        this.currentDashboard = null;
    }

    cancelCreateItem() {
        this.currentDashboard = null;
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
        this.currentDashboard = 'runningSession';
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
        this.currentDashboard = 'myItems';
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
        this.currentDashboard = 'myOrders';
        this.sessionService.getAllSessionsByWinnerId(this.user.id).subscribe((res: any) => {
            this.orderList = res;    
        })
        this.messageService.add({
            severity: 'info',
            summary: 'Hiển thị lịch sử thắng đấu giá của tôi!'
        })
    }

    showSystemOrders () {
        this.currentDashboard = 'systemOrders'
        this.sessionService.getOrder().subscribe((res: any) => {
            this.systemOrderList = res;
    
        })
        this.messageService.add({
            severity: 'info',
            summary: 'Hiển thị lịch sử thắng đấu giá của mọi người!'
        })
    }

    showMyTransaction() {
        this.currentDashboard = 'myTransactions';

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

        this.messageService.add({
            severity: 'info',
            summary: 'Hiển thị lịch sử đặt giá!'
        })
    }

    onCancelProfile() {
        this.currentDashboard = null;
    }

    get userForm() {
        return this.newUserForm.controls;
    }

    createNewUser() {
        this.currentDashboard = 'createUser';
        this.newUserForm = this.formBuilder.group({
            name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onCancelCreateUser() {
        this.currentDashboard = null;
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

    isEmail(search: string): boolean {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        const email: string = search;
        const result: boolean = expression.test(email);
        return result
    }

}
