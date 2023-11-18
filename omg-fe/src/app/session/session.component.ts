import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { Item } from '../item/item';
import { SessionService } from 'src/service/sessionService';
import { Session } from './session';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { map } from 'rxjs';
import { TransactionService } from 'src/service/transactionService';
import { UserService } from 'src/service/userService';
import { User } from '../user/user';
import { OrderService } from 'src/service/orderService';
import { ItemService } from 'src/service/itemService';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SessionComponent),  // replace name as appropriate
      multi: true
    }
  ]
})
export class SessionComponent implements OnInit {
  @Input() sessionId!: number;
  
  currentPrice!: number;
  public session!: Session;
  item!: Item;

  plateNumber!: string;

  buttonDisabled: boolean = false;
  likeButtonDisabled: boolean = true;

  closeTime!: Date;
  startTime!: Date;

  currentTime: Date = new Date();
  sessionDuration!: any;
  
  reversePrice!: number;

  stepPrice!: number;

  status!: string;

  winner!: User;
  winnerInfo!: string;

  constructor(
    private sessionService: SessionService,
    private transactionService: TransactionService,
    private userService: UserService,
    private itemService: ItemService,
    private orderService: OrderService
  ) {}
  ngOnInit(): void {
    this.sessionService.getOne(this.sessionId).subscribe((res:any) => {
      this.session = res;
      this.item = this.session.item;
      this.currentPrice = this.session.currentPrice;
      this.closeTime = new Date (this.session.closeTime);
      
      this.startTime = new Date (this.session.startTime);
      this.plateNumber = this.session.item.plateNumber;
      this.stepPrice = this.session.stepPrice;
      this.reversePrice = this.session.reversePrice;
      this.winner = this.session.winner;
          
      this.status = this.session.status;
      if(this.session.winner != null) {
        this.winnerInfo = this.session.winner.name;
      } else {
        this.winnerInfo = 'Chưa rõ';
      }
    })

    //this.updateTime();

    setInterval(() => {
      this.updateTime();
      //this.updateSession();
    }, 1000);
  }

  likeButtonClicked() {
    this.currentPrice += this.stepPrice;
    this.likeButtonDisabled = true;
  }

  disLikeButtonClicked() {
    this.currentPrice -= this.stepPrice;
  }

  saveButtonClicked() {
    this.session.currentPrice = this.currentPrice;
    this.session.winner = <User>this.userService.getSigninUser();
    this.session.status = this.status;
    this.sessionService.saveOne(this.session).subscribe((res:any) => {
      this.currentPrice = res.currentPrice;
      
      this.winner = res.winner;
      this.transactionService.createTransaction({
        money: this.currentPrice,
        user: this.userService.getSigninUser(),
        session: this.session
      })
    });
  }


  updateTime() {
    this.currentTime = new Date();
    let diffTime = 0;
    let notify = "";
    
    // clock configure 
    if (this.currentTime.getTime() < this.startTime.getTime() && 
    this.currentTime.getTime() - this.startTime.getTime() < 0) {
      diffTime = this.startTime.getTime() - this.currentTime.getTime();
      notify = "Bắt đầu sau: ";
      this.buttonDisabled = true;
      this.status = "upcoming";
    } else if (this.currentTime.getTime() > this.startTime.getTime() 
      && this.currentTime.getTime() < this.closeTime.getTime() && 
      this.closeTime.getTime() - this.currentTime.getTime() > 0) {
        notify = "Kết thúc sau: ";
        this.likeButtonDisabled = false;
        this.buttonDisabled = false;
        diffTime = this.closeTime.getTime() - this.currentTime.getTime();
        this.status = "opening"
    } else {
      notify = "Đã kết thúc được: ";
      diffTime = this.currentTime.getTime() - this.closeTime.getTime();
      this.buttonDisabled = true;
      this.likeButtonDisabled = true;
      this.status = "closed";
    }

    this.sessionService.autoUpdateSession().subscribe((res: any) => {
      this.currentPrice = res.currentPrice;
      this.winner = res.winner;
      this.winnerInfo = res.winner.name;

      this.closeTime = new Date(res.closeTime);
    })
    const hours = Math.floor(diffTime / 3600000);
    const minutes = Math.floor((diffTime % 3600000) / 60000);
    const seconds = Math.floor((diffTime % 60000) / 1000);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    this.sessionDuration = notify + `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  buyButtonClicked() {
    this.buttonDisabled = true;
    this.likeButtonDisabled = true;

    this.session.closeTime = this.currentTime.toISOString();
    //console.log(this.session.closeTime);
    this.session.winner = <User>this.userService.getSigninUser();
    this.session.status = "closed";
    this.session.currentPrice = this.session.reversePrice;
    this.currentPrice = this.reversePrice;
    this.winnerInfo = this.session.winner.name;

    this.sessionService.buyReversePrice(this.session).subscribe((res:any) => {
      this.winner = res.winner;
      this.winnerInfo = res.winner.name;
    });
  }


}
