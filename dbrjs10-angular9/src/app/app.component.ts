import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dbrjs10-angular9';

  mode: string = 'video';

  switchMode(value: string) {
    this.mode = value;
  }
}
