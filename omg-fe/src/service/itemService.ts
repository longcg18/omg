import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,of} from 'rxjs';
import { Item } from '../app/item/item';

const httpOptions ={
    headers:new HttpHeaders({'Content-Type':'Application/json'})
  }

const getOneItem = 'http://localhost:3000/item/';

const saveOne = 'http://localhost:3000/item/';

const getAllItems = 'http://localhost:3000/item/';

const createOneItem = 'http://localhost:3000/item/'

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    constructor(private httpClient: HttpClient) {
    
    }

    getOne(id: any):Observable<Item> {
        return this.httpClient.get<Item>(getOneItem + id).pipe();
    }

    saveOne(item: Item) {
        return this.httpClient.put(saveOne, item).subscribe();
    }

    getAllItems():Observable<Item[]> {
        return this.httpClient.get<Item[]>(getAllItems).pipe();
    }

    createOne(item: any) {
        console.log(item);
        return this.httpClient.post(createOneItem, item).subscribe();
    }
}