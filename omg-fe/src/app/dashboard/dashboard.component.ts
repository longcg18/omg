import { Component, OnInit } from '@angular/core';
import { Item } from '../item/item';
import { ItemService } from '../../service/itemService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  itemList!: Item[]; 
  currentTime!: Date;
  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe((res: any) => {
      this.itemList = res;
    })

    setInterval(()=>{
      this.updateTime()
    }, 1000)
  }

  updateTime() {
    this.currentTime = new Date();
  }
}
