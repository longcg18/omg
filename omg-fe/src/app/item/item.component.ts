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
  available: boolean = false;
  currentTime: Date = new Date();

  startTime!: Date;

  constructor(
    private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getOne(this.itemId).subscribe((res: any) => {
      this.item = res || null;
      this.likeCounter = this.item.likes || 0;
      this.startTime = new Date (this.item.time);
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
    if (this.available == true) {
      this.available = false;
    } else {
      this.available = true;
    }
  }

  saveButtonClicked() {
    this.item.likes = this.likeCounter;
    this.itemService.saveOne(this.item);
  }

  updateTime() {
    this.currentTime = new Date();
  }
}
