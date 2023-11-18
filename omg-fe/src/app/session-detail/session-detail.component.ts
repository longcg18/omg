import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SessionService } from 'src/service/sessionService';
import { Item } from '../item/item';
import { User } from '../user/user';
import { Session } from '../session/session';
import { ItemService } from 'src/service/itemService';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.css']
})
export class SessionDetailComponent implements OnInit{

  @Input() sessionId!: any;

  plateNumber!: string;
  item!: Item;

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
  winnerInfo!: string;

  message!: string;
  timeNote!: string;
  
  onFocus: boolean = true;

  constructor(
    private sessionService: SessionService, 
    private messageService: MessageService,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router) {
      this.route.params.subscribe(params => {
        this.sessionId = params['sessionId'];
      })
    }

  ngOnInit(): void {
    console.log(DashboardComponent.currentDashboard);
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

      })
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


    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    this.currentTime = new Date();
    let diffTime = 0;
    let notify = "";
    
    // clock configure 
    if (this.currentTime.getTime() < this.startTime.getTime() && 
    this.currentTime.getTime() - this.startTime.getTime() < 0) {
      diffTime = this.startTime.getTime() - this.currentTime.getTime();
      notify = "Chưa bắt đầu ";
      //this.buttonDisabled = true;
      this.status = "upcoming";
    } else if (this.currentTime.getTime() > this.startTime.getTime() 
      && this.currentTime.getTime() < this.closeTime.getTime() && 
      this.closeTime.getTime() - this.currentTime.getTime() > 0) {
        notify = "Đang diễn ra ";
        // this.likeButtonDisabled = false;
        // this.buttonDisabled = false;
        diffTime = this.closeTime.getTime() - this.currentTime.getTime();
        this.status = "opening"
    } else {
      notify = "Đã kết thúc";
      diffTime = this.currentTime.getTime() - this.closeTime.getTime();
      // this.buttonDisabled = true;
      // this.likeButtonDisabled = true;
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
}
