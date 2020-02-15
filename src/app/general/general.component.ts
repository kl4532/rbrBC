import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit, OnDestroy {

  constructor(private srv: DataService) { }
  drivers: Driver[];
  currentStage: number;
  subscription: Subscription;

  ngOnInit() {
    this.subscription = this.srv.getTotalResults()
      .subscribe(data => {
        this.drivers = data.drivers;
        this.currentStage = data.currentStage
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //now time to sort times and include gap in display
}
