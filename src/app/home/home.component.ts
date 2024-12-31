import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, MenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
