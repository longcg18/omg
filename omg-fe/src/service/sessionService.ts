import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,of} from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Session } from 'src/app/session/session';


const httpOptions ={
    headers:new HttpHeaders({'Content-Type':'Application/json'})
}

const getOneSession = 'http://localhost:3000/session/';

const saveOne = 'http://localhost:3000/session/';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    constructor(private httpClient: HttpClient, public socket: Socket) {}

    createOne(session: Session) {
        console.log(session);
        return this.httpClient.post(saveOne, session).subscribe();
    }

    getOne(id: any): Observable<Session> {
        return this.httpClient.get<Session>(getOneSession + id).pipe();
    }

    saveOne(session: any): Observable<Session> {
        this.socket.emit('setPrice', {
            session
        });
        //console.log(session);
        return this.socket.fromEvent<Session>('updatedPrice').pipe();
    }

    getAllSessionsByWinnerId(userId: any): Observable<Session[]> {
        return this.httpClient.get<Session[]>(saveOne + 'user/' + userId).pipe();
    }

    getAllSessions(): Observable<Session[]> {
        return this.httpClient.get<Session[]>(saveOne).pipe();
    }

    getOrder(): Observable<Session[]> {
        return this.httpClient.get<Session[]>(saveOne + 'history').pipe();
    }

    buyReversePrice(session: any): Observable<Session> {
        this.socket.emit('setPrice', {
            session
        });
        return this.socket.fromEvent<Session>('updatedPrice').pipe();
    }

    autoUpdateSession(): Observable<Session> {
        return this.socket.fromEvent<Session>('updatedPrice').pipe();
    }
}