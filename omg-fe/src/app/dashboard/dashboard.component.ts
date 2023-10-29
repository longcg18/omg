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

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe((res: any) => {
      this.itemList = res;
    })
  }
}
