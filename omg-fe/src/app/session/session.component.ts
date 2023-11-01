import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { Item } from '../item/item';
import { SessionService } from 'src/service/sessionService';
import { Session } from './session';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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

  plateNumber: string = '00A-00000';

  buttonDisabled: boolean = false;

  closeTime!: Date;
  startTime!: Date;

  currentTime: Date = new Date();
  sessionDuration!: any;
  
  reversePrice!: number;

  stepPrice: number = 10000;

  constructor(
    private sessionService: SessionService
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
      //console.log(this.session.item);
    })

    //this.updateTime();

    setInterval(() => {
      this.updateTime();
    }, 1000)
  }

  likeButtonClicked() {
    this.currentPrice += this.stepPrice;
  }

  disLikeButtonClicked() {
    this.currentPrice -= this.stepPrice;
  }

  saveButtonClicked() {
    this.session.currentPrice = this.currentPrice;
    this.sessionService.saveOne(this.session);
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

    } else if (this.currentTime.getTime() > this.startTime.getTime() 
      && this.currentTime.getTime() < this.closeTime.getTime() && 
      this.closeTime.getTime() - this.currentTime.getTime() > 0) {
        notify = "Kết thúc sau: ";
        diffTime = this.closeTime.getTime() - this.currentTime.getTime();
    } else {
      notify = "Đã kết thúc được: ";
      diffTime = this.currentTime.getTime() - this.closeTime.getTime();
      this.buttonDisabled = true;
    }

    const hours = Math.floor(diffTime / 3600000);
    const minutes = Math.floor((diffTime % 3600000) / 60000);
    const seconds = Math.floor((diffTime % 60000) / 1000);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    this.sessionDuration = notify + `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
