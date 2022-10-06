import { Component } from '@angular/core';

import { AuthService } from '../app/services/auth.service';
import { UsersService } from '../app/services/users.service';
import { User, CreateUserDTO } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token: string = '';
  userLogued: string = '';

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    const dto: CreateUserDTO = {
      name: 'Sebas',
      email: 'sebas@mail.com',
      password: '1122',
    };
    this.usersService.create(dto).subscribe((rta) => console.log(rta));
  }
  login() {
    const email: string = 'sebas@mail.com';
    const password: string = '1122';
    this.authService.login(email, password).subscribe((rta) => {
      console.log(rta.access_token);
      this.token = rta.access_token;
    });
  }

  getProfile() {
    this.authService.profile(this.token).subscribe((profile) => {
      console.log(profile);
      this.userLogued = profile.email;
    });
  }

  showUserLogued() {
    return this.userLogued;
  }
}
