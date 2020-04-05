import { Component } from '@angular/core';
import { version } from '../../package.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router){

  }
  public version: string = version;

  ngOnInit() {
    this.router.navigateByUrl('/settings');
  }
}
