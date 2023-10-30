import { Component, OnInit, Input } from '@angular/core';
import { Item } from './item';
import { ItemService } from '../../service/itemService';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit{
  @Input() itemId!: number;
  likeCounter!: number;
  item!: Item;
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
      this.likeCounter = this.item.likes || 0;
      this.closeTime = new Date (this.item.time);
      
    });
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
    this.item.likes = this.likeCounter;
    this.itemService.saveOne(this.item);
  }

  updateTime() {
    this.currentTime = new Date();
    let diffTime = this.closeTime.getTime() - this.currentTime.getTime();

    if (this.currentTime.getTime() < this.closeTime.getTime()) {

      const minutes = Math.floor(diffTime / 60000);
      const seconds = ((diffTime % 60000) / 1000).toFixed(0);
      const hours = Math.floor(diffTime / 3600000);
      const timeDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      this.sessionDuration = timeDisplay;
    } else {
      this.sessionDuration = "Đã kết thúc";
      this.buttonDisabled = true;

    }
  }
}
