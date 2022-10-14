import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.API_URL}/api/auth`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string) {
    return this.http
      .post<Auth>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(
          //tap ya tiene el response del login y lo que quiero es ir a llamar al servicio y guardar el token, el metodo no es asíncrono por lo que podemos ejecutarlo en el tap.
          (response) => this.tokenService.saveToken(response.access_token)
        )
      );
  }

  // profile(token: string) {
  //   // const headers = new HttpHeaders();
  //   // headers.set('Authorization', `Bearer ${token}`);
  //   return this.http.get<User>(`${this.apiUrl}/profile`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       // 'Content-type': 'application/json'
  //     },
  //   });
  // }

  //El objetivo es que el interceptor automaticamente detecte e inserte el token para
  profile() {
    //si lo tiene al token lo agrega sino no
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }
}
