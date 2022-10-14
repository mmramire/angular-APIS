import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AuthService } from '../app/services/auth.service';
import { FilesService } from '../app/services/files.service';
import { UsersService } from '../app/services/users.service';
import { User, CreateUserDTO } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private apiUrl = `${environment.API_URL}/api/files`;

  imgParent = '';
  showImg = true;
  // token: string = '';
  userLogued: string = '';
  imgRta = '';

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private filesService: FilesService
  ) {}

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    const dto: CreateUserDTO = {
      name: 'keinner olivares',
      email: 'rkeinneroa@gmail.com',
      password: '1212',
    };
    this.usersService.create(dto).subscribe((rta) => console.log(rta));
  }
  login() {
    const email: string = 'rkeinneroa@gmail.com';
    const password: string = '1212';
    this.authService.login(email, password).subscribe((rta) => {
      console.log(rta.access_token);
      this.authService.profile().subscribe((data) => {
        console.log(data);
        this.userLogued = data.email;
      });
      // this.token = rta.access_token;
    });
  }

  // getProfile() {
  //   // this.authService.profile(this.token).subscribe((profile) => {
  //   //   console.log(profile);
  //   //   this.userLogued = profile.email;
  //   // });
  //   this.authService.profile().subscribe();
  // }

  showUserLogued() {
    return this.userLogued;
  }

  downloadPdf() {
    this.filesService
      .getFile('myPdf', `${this.apiUrl}/dummy.pdf`, 'application/pdf')
      .subscribe();
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement; //HTMLInputElement es una interface
    const file = element.files?.item(0);
    if (file) {
      this.filesService.uploadFile(file).subscribe((rta) => {
        this.imgRta = rta.location;
      });
    }
  }
}
