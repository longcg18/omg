import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,of} from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Order } from 'src/app/order/order';

const httpOptions ={
    headers:new HttpHeaders({'Content-Type':'Application/json'})
  }

const saveOne = 'http://localhost:3000/order/';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private httpClient: HttpClient) {
    }

    getOne(id: any):Observable<Order> {
        return this.httpClient.get<Order>(saveOne + id).pipe();
    }

    saveOne(order: Order): Observable<Order> {

        return this.httpClient.put<Order>(saveOne, order).pipe();
        //return this.socket.fromEvent<Item>('updated').pipe();
    }

    getAllOrders():Observable<Order[]> {
        return this.httpClient.get<Order[]>(saveOne).pipe();
    }

    createOne(order: any) {
        return this.httpClient.post(saveOne, order).subscribe();
    }

    // createOne(item: any, user: any) {
    //     item.ownershipNumber = user.username + item.plateNumber;
    //     item.owner = user;
    //     //console.log(item);
    //     return this.httpClient.post(saveOne, item).subscribe();
    // }


    getAllOrderByUserId(userId: any): Observable<Order[]> {
        return this.httpClient.get<Order[]>(saveOne + 'owner/' + userId).pipe();
    }
    
}