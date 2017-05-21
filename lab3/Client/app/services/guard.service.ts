import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';

@Injectable()
export class Guard implements CanActivate {
  canActivate() {
    return (window.localStorage.getItem("jwt_token") !== null);
  }
}
