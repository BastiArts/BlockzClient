import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {DataService} from './data.service';

@Injectable({
    providedIn: 'root'
})
export class GameGuard implements CanActivate {
    constructor(private dataservice: DataService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.dataservice.blockzUser.username !== '' && this.dataservice.blockzUser.game !== '';
    }

}
