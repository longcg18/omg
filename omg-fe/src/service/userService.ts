import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "src/app/user/user";
import { JwtHelperService } from '@auth0/angular-jwt';

//import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";


const httpOptions ={
    headers:new HttpHeaders({'Content-Type':'Application/json'})
}

const saveOne = 'http://localhost:3000/user/';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(private router: Router, private httpClient: HttpClient, private jwtService: JwtHelperService) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    createOne(user: User): Observable<User> {
        //console.log(user);
        return this.httpClient.post<User>(saveOne, user).pipe();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    getOne(userId: any): Observable<User> {
        return this.httpClient.get<User>(saveOne + userId).pipe();
    }

    login(username: string, password: string) {

        return this.httpClient.post<User>(`http://localhost:3000/auth/login`, { username, password }).pipe(map((res: any) => {
            console.log(res);
            localStorage.setItem('user', JSON.stringify(res.res));
            this.userSubject.next(res.res);
            return res.res;
        }))
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/signin']);
    }

    getSigninUser() {
        //console.log(this.userSubject.value);
        return this.userSubject.value;
    }

    updateProfile(user: any): Observable<User> {
        return this.httpClient.put<User>(saveOne, user).pipe()
    }

    getAllUser(): Observable<User[]> {
        return this.httpClient.get<User[]>(saveOne).pipe();
    }
}