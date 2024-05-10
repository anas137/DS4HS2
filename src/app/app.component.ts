import { Component } from '@angular/core';
import { WamhostWCComponent } from './wamhost-wc/wamhost-wc.component';
import { DisplayComponent } from './display/display.component';
import { RouterOutlet,RouterLink } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WamhostWCComponent, DisplayComponent,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'prova';
}
