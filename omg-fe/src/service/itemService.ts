import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,of} from 'rxjs';
import { Item } from '../app/item/item';
import { Socket } from 'ngx-socket-io';

const httpOptions ={
    headers:new HttpHeaders({'Content-Type':'Application/json'})
  }

const getOneItem = 'http://localhost:3000/item/';

const saveOne = 'http://localhost:3000/item/';

const getAllItems = 'http://localhost:3000/item/';

const createOneItem = 'http://localhost:3000/item/'

const createOneItemwithImage = 'http://localhost:3000/item/upload'

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    constructor(private httpClient: HttpClient) {
    }

    getOne(id: any):Observable<Item> {
        return this.httpClient.get<Item>(getOneItem + id).pipe();
    }

    getAll(): Observable<Item[]> {
        return this.httpClient.get<Item[]>(getAllItems).pipe();
    }

    saveOne(item: Item): Observable<Item> {
        return this.httpClient.put<Item>(saveOne, item).pipe();
        //return this.socket.fromEvent<Item>('updated').pipe();
    }

    getAllItems():Observable<Item[]> {
        return this.httpClient.get<Item[]>(getAllItems).pipe();
    }

    createOne(formData: FormData, user: any) {
        let plateNumber = formData.get('plateNumber')?.toString();
        let vendoer = '';

        var item: any = {
            plateNumber: formData.get('plateNumber')?.toString(),
            type: formData.get('type')?.toString(),
            ownershipNumber: user.username + formData.get('plateNumber'),
            vendor: formData.get('vendor')?.toString(),
            status: 'available',
            image: formData.get('image'),
            owner: user
        };
        var file = item.image;
        formData.append('ownerId', user.id);
        formData.append('ownershipNumber', user.username + formData.get('plateNumber'));


        //console.log(formData);
        return this.httpClient.post<any>(createOneItemwithImage, formData).subscribe({
            error: (error: any) => console.log(error)
        });
    }

    getAllItemByUserId(userId: any): Observable<Item[]> {
        return this.httpClient.get<Item[]>(getAllItems + 'owner/' + userId).pipe();
    }
}