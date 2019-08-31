import { Injectable } from '@angular/core';
import { Router, CanActivate, Route } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _userService: UserService
    ) {
    }
    canActivate() {
        // tslint:disable-next-line:prefer-const
        let identity = this._userService.getIdentidad();
        if (identity && (identity.role === 'ROLE USER' || identity.role === 'ROLE ADMIN')) {
            return true;
        } else {
            this._router.navigate(['/home']);
            return false;
        }
    }
}
