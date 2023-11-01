import { Component, OnInit, forwardRef } from '@angular/core';
import { Item } from '../item/item';
import { ItemService } from '../../service/itemService';
import { MenuItem } from 'primeng/api';
import { Session } from '../session/session';
import { SessionService } from 'src/service/sessionService';
import { FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  newItem: Item = {
      plateNumber: "",
      id: 0,
      type: '',
      vendor: null,
      status: null
  };

  currentItem!: Item;



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

  constructor(private itemService: ItemService, private sessionService: SessionService) {
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
                label: 'Export',
                icon: 'pi pi-fw pi-external-link'
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
        icon: 'pi pi-fw pi-power-off'
    }
    ]

    this.sessionService.getAllSessions().subscribe((res: any) => {
        this.sessionList = res;
    })

    // this.itemService.getAllItems().subscribe((res: any) => {
    //   this.itemList = res;
    // })

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
    this.itemService.createOne(this.newItem);
    window.location.reload();
  }

  createSession() {
    this.itemService.getOne(this.itemIdPicker).subscribe((res: any) => {
        console.log(res);
        this.currentItem = res;

        var newSession: Session = {
            id: 0,
            startTime: this.newSession.startTime,
            closeTime: this.newSession.closeTime,
            initiatePrice: this.newSession.initiatePrice,
            reversePrice: this.newSession.reversePrice,
            stepPrice: this.newSession.reversePrice,
            currentPrice: 0,
            item: this.currentItem
        }
        this.sessionService.createOne(newSession);
    })
    //console.log(this.newSession);
    
    //window.location.reload();
  }
}
