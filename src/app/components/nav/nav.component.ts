import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  activeMenu = false;
  counter = 0;
  @Input() userLogued: string = '';

  constructor(
    private storeService: StoreService,
    private authService: AuthService
  ) {
    console.log('constructor de NavComponent');
  }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe((products) => {
      this.counter = products.length;
      console.log('ngOnInit de NavComponent');
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
    console.log('toggleMenu de NavComponent');
  }
}
