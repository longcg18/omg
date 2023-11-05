import { Component, OnInit, forwardRef } from '@angular/core';
import { Item } from '../item/item';
import { ItemService } from '../../service/itemService';
import { MenuItem } from 'primeng/api';
import { Session } from '../session/session';
import { SessionService } from 'src/service/sessionService';
import { FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserService } from 'src/service/userService';
import { User } from '../user/user';
import { DOCUMENT } from '@angular/common';

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
  currentTime!: Date;
  menuItems!: MenuItem[];
  hasShowItemForm: boolean = false;
  hasShowSessionForm: boolean = false;

  showItem: boolean = false;
  selectedItem!: Item;
  newItem: Item = {
      plateNumber: "",
      id: 0,
      type: '',
      ownershipNumber: '',
      vendor: null,
      status: null
  };

  currentItem!: Item ;

  user: any = this.userService.getSigninUser();

  itemIdPicker!: number;

  newSession: Session = {
      id: 0,
      startTime: '',
      closeTime: '',
      initiatePrice: 100000,
      reversePrice: 1000000,
      stepPrice: 20000,
      currentPrice: 0,
      item: this.currentItem
  }

  formGroup!: FormGroup;

  constructor(private itemService: ItemService, private sessionService: SessionService, public userService: UserService) {
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
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
            {
                label: 'Left',
                icon: 'pi pi-fw pi-align-left'
            },
            {
                label: 'Right',
                icon: 'pi pi-fw pi-align-right'
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
                label: 'Delete',
                icon: 'pi pi-fw pi-user-minus'
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
        this.sessionList = res;
    })

    this.itemService.getAllItemByUserId(this.user.id).subscribe((res: any) => {

       this.itemList = res;
       this.currentItem = this.itemList[0];

    })

    this.formGroup = new FormGroup({
        itemSelector: new FormControl<Item> (this.selectedItem)
        
    })
    //console.log(this.selectedItem);

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

  showSessionForm() {
    this.hasShowSessionForm = true;
  }

  createItem() {
    //this.newItem.time = this.currentTime.toDateString();
    console.log(this.newItem);
    this.itemService.createOne(this.newItem, this.user);
    window.location.reload();
  }

  logOut() {
    this.userService.logout();
  }

  createSession() {
    var newSession: Session = {
        id: 0,
        startTime: this.newSession.startTime,
        closeTime: this.newSession.closeTime,
        initiatePrice: this.newSession.initiatePrice,
        reversePrice: this.newSession.reversePrice,
        stepPrice: this.newSession.reversePrice,
        currentPrice: 0,
        item: this.formGroup.get('itemSelector')?.value
    }
    this.sessionService.createOne(newSession);
    window.location.reload();
  }

  showMyItem() {
    const itemContainer = document.getElementById("item-container");
    if (itemContainer?.style.display==='none') {
        itemContainer.style.display = '';        
    }
  }
}
