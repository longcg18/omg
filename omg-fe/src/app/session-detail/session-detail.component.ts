import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { SessionService } from 'src/service/sessionService';
import { Item } from '../item/item';
import { User } from '../user/user';
import { Session } from '../session/session';
import { ItemService } from 'src/service/itemService';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from 'src/service/userService';
import { TransactionService } from 'src/service/transactionService';

@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.css'],
  providers:[ConfirmationService]
})
export class SessionDetailComponent implements OnInit{

  @Input() sessionId!: any;

  plateNumber!: string;
  item!: Item;

  user: any = this.userService.getSigninUser();


  closeSessionInfo: boolean = false;

  closeTime!: Date;
  startTime!: Date;

  imageSrc!: any;
  currentTime: Date = new Date();
  sessionDuration!: any;

  session!: Session;
  reversePrice!: number;
  stepPrice!: number;
  currentPrice!: number;

  status!: string;
  winner!: User;
  owner!: User;
  ownerName!: string;
  ownerId!: number;
  winnerInfo!: string;

  message!: string;
  timeNote!: string;
  
  buyButtonDisabled = false;
  setPriceButtonDisabled = false;
  onFocus: boolean = true;
  notifications!: Set<string>;

  nextPrice!: string;

  constructor(
    private sessionService: SessionService, 
    private messageService: MessageService,
    private itemService: ItemService,
    private userService: UserService,
    private route: ActivatedRoute,
    private confirmService: ConfirmationService,
    private transactionService: TransactionService,
    private router: Router) {
      this.route.params.subscribe(params => {
        this.sessionId = params['sessionId'];
      })
    }

  ngOnInit(): void {

    this.notifications = new Set<string>();
    this.sessionService.getOne(this.sessionId).subscribe((res: any) => {
      this.session = res;
      this.item = this.session.item;

      
      this.itemService.getOne(this.item.id).subscribe((item: any) => {
        if (item.image) {
          var itemImage = new Image();
          itemImage.src = 'data:image/jpeg;base64,' + item.image;
          this.imageSrc = itemImage.src;
        } else {
          this.imageSrc = "https://primefaces.org/cdn/primeng/images/usercard.png";
        }
        // console.log(this.item);
        this.userService.getOne(item.ownerId).subscribe((res: any) => {
          this.owner = res;
          this.ownerName = this.owner.name;
          this.ownerId = this.owner.id;
        });


      })

      if (this.user.id == this.ownerId) {
        this.buyButtonDisabled = true;
        this.setPriceButtonDisabled = true;
      }

      this.currentPrice = this.session.currentPrice;
      this.closeTime = new Date (this.session.closeTime);
      
      this.startTime = new Date (this.session.startTime);
      this.plateNumber = this.session.item.plateNumber;
      this.stepPrice = this.session.stepPrice;
      this.reversePrice = this.session.reversePrice;
      if (this.currentPrice == this.reversePrice) {
        this.nextPrice = "Không khả dụng"
      } else {
        this.nextPrice = "$" + (this.currentPrice + this.stepPrice).toString(); 
      }
      this.winner = this.session.winner;
          

      this.status = this.session.status;
      if(this.session.winner != null) {
        this.winnerInfo = this.session.winner.name;
      } else {
        this.winnerInfo = 'Chưa rõ';
      }
    })
    this.buyButtonDisabled = true;
    this.setPriceButtonDisabled = true;

    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    this.currentTime = new Date();
    let diffTime = 0;
    let notify = "";
    //console.log(this.startTime);
    
    if (this.currentTime.getTime() < this.startTime.getTime() && 
    this.currentTime.getTime() - this.startTime.getTime() < 0) {
      diffTime = this.startTime.getTime() - this.currentTime.getTime();
      notify = "Chưa bắt đầu ";
      this.buyButtonDisabled = true;
      this.setPriceButtonDisabled = true;
      this.status = "upcoming";
    } else if (this.currentTime.getTime() > this.startTime.getTime() 
      && this.currentTime.getTime() < this.closeTime.getTime() && 
      this.closeTime.getTime() - this.currentTime.getTime() > 0) {
        notify = "Đang diễn ra ";
        this.buyButtonDisabled = false;
        if (this.user.id == this.ownerId) {
          this.buyButtonDisabled = true;
          this.setPriceButtonDisabled = true;
        } else {
          this.setPriceButtonDisabled = false;
        }
        if (this.currentPrice > this.reversePrice / 3) {
          this.buyButtonDisabled = true;
        }
        diffTime = this.closeTime.getTime() - this.currentTime.getTime();
        this.status = "opening"
    } else {
      this.closeSessionInfo = true;


      notify = "Đã kết thúc";
      diffTime = this.currentTime.getTime() - this.closeTime.getTime();
      this.buyButtonDisabled = true;
      this.setPriceButtonDisabled = true;
      this.status = "closed";
    } 

    // auto update session by seconds
    this.sessionService.autoUpdateSession().subscribe((res: any) => {
      this.currentPrice = res.currentPrice;
      this.winner = res.winner;
      this.winnerInfo = this.winner.name;
      this.closeTime = new Date(res.closeTime);
      if (this.user.id == this.ownerId) {
        this.buyButtonDisabled = true;
        this.setPriceButtonDisabled = true;
      }
      if (this.currentPrice > res.reversePrice / 3) {
        this.buyButtonDisabled = true;
      }
      if (this.reversePrice == res.currentPrice) {
        this.notifications.add("Người dùng " + this.winner.name + " đã mua với giá " + this.currentPrice + "USD")
      } else {
        this.notifications.add("Người dùng " + this.winner.name + " vừa tăng giá lên " + this.currentPrice + "USD")
      }

      if (this.currentPrice == this.reversePrice) {
        this.nextPrice = "Không khả dụng"
      } else {
        this.nextPrice = "$" + (this.currentPrice + this.stepPrice).toString(); 
      }
    })
    const hours = Math.floor(diffTime / 3600000);
    const minutes = Math.floor((diffTime % 3600000) / 60000);
    const seconds = Math.floor((diffTime % 60000) / 1000);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    this.sessionDuration = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    this.timeNote = notify;
  }

  quitSession() {
    this.onFocus = false;
    DashboardComponent.currentDashboard = "runningSession";
    this.router.navigateByUrl('dashboard')
  }


  getCurrentDashboard() {
    return DashboardComponent.currentDashboard;
  }

  setPrice() {
    this.confirmService.confirm({
      message: 'Bạn muốn tăng giá sản phẩm?',
      header: 'Đặt giá',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.currentPrice += this.stepPrice;
        this.session.currentPrice = this.currentPrice;
        this.session.winner = <User>this.userService.getSigninUser();
        this.session.status = this.status;
        var req: any = {
          id: this.sessionId,
          currentPrice: this.currentPrice,
          winner: this.session.winner,
          status: this.session.status,
          startTime: this.session.startTime,
          closeTime: this.session.closeTime
        }
        this.sessionService.saveOne(req).subscribe((res:any) => {
          this.currentPrice = res.currentPrice;
          this.winner = res.winner;
          this.transactionService.createTransaction({
            money: this.currentPrice,
            user: this.userService.getSigninUser(),
            session: this.session
          })
        });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
              this.messageService.add({ severity: 'error', summary: 'Từ chối', detail: 'Bạn đã từ chối' });
              break;
          case ConfirmEventType.CANCEL:
              this.messageService.add({ severity: 'warn', summary: 'Huỷ', detail: 'Bạn đã huỷ' });
              break;
        }
      }

    })
  }

  buyButtonClicked() {
    this.confirmService.confirm({
      message: 'Bạn muốn mua sản phẩm với giá tối đa chứ?',
      header: 'Mua sản phẩm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.setPriceButtonDisabled = true;

        this.session.closeTime = this.currentTime.toISOString();
        this.session.winner = <User>this.userService.getSigninUser();
        this.session.status = "closed";
        this.session.currentPrice = this.session.reversePrice;
        this.currentPrice = this.reversePrice;
        this.winnerInfo = this.session.winner.name;

        var req: any = {
          id: this.sessionId,
          currentPrice: this.currentPrice,
          winner: this.session.winner,
          status: this.session.status,
          startTime: this.session.startTime,
          closeTime: this.session.closeTime
        }

        this.sessionService.buyReversePrice(req).subscribe((res:any) => {
          this.winner = res.winner;
          this.winnerInfo = res.winner.name;

          this.transactionService.createTransaction({
            money: this.currentPrice,
            user: this.userService.getSigninUser(),
            session: this.session
          })
        });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
              this.messageService.add({ severity: 'error', summary: 'Từ chối', detail: 'Bạn đã từ chối' });
              break;
          case ConfirmEventType.CANCEL:
              this.messageService.add({ severity: 'warn', summary: 'Huỷ', detail: 'Bạn đã huỷ' });
              break;
        }
      }
    })
  }
}
