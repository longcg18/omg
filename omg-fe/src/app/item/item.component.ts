import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { Item } from './item';
import { ItemService } from '../../service/itemService';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
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
  likeCounter!: number;
  public item!: Item;
  buttonDisabled: boolean = false;
  currentTime: Date = new Date();
  closeTime!: Date;
  plateNumber!: string;
  sessionDuration!: any;

  constructor(
    private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getOne(this.itemId).subscribe((res: any) => {
      this.item = res || null;
      this.plateNumber = this.item.plateNumber;
      //this.closeTime = new Date (this.item.time);
    });

      this.itemService.socket.on('updated', (updatedItem: any) => {
          this.updateLikes(updatedItem.likes);
      })
  
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  likeButtonClicked() {
    this.likeCounter += 1;
  }

  disLikeButtonClicked() {
    this.likeCounter -= 1;
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

  updateTime() {
    this.currentTime = new Date();
    let diffTime = this.closeTime.getTime() - this.currentTime.getTime();
  
    if (this.currentTime.getTime() < this.closeTime.getTime() && diffTime > 0) {
      const hours = Math.floor(diffTime / 3600000);
      const minutes = Math.floor((diffTime % 3600000) / 60000);
      const seconds = Math.floor((diffTime % 60000) / 1000);
  
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
  
      this.sessionDuration = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      this.sessionDuration = "Đã kết thúc";
      this.buttonDisabled = true;
    }
  }  

  updateLikes(newLikes: number) {
    this.likeCounter = newLikes;
  }
}
