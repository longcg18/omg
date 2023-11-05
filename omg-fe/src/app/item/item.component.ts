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
  plateNumber!: string;
  sessionDuration!: any;
  vendor!: string | null;
  type!: string;

  constructor(
    private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getOne(this.itemId).subscribe((res: any) => {
      this.item = res || null;
      this.plateNumber = this.item.plateNumber;
      this.vendor = this.item.vendor;
      this.type = this.item.type;
      //this.closeTime = new Date (this.item.time);
    });
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

  updateLikes(newLikes: number) {
    this.likeCounter = newLikes;
  }
}
