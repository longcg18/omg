import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,of} from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Transaction } from 'src/app/transaction/transaction';

const httpOptions = {
    headers:new HttpHeaders({'Content-Type':'Application/json'})
}

const saveOne = 'http://localhost:3000/transaction/';


@Injectable({providedIn: 'root'})
export class TransactionService {

    constructor (private httpClient: HttpClient) {

    }

    getAllTransaction(userId: any): Observable<Transaction[]> {
        return this.httpClient.get<Transaction[]>(saveOne + 'owner/' + userId).pipe();
    }
}