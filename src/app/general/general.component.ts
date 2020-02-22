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
  player: Driver;

  ngOnInit() {
    this.subscription = this.srv.getTotalResults()
      .subscribe(data => {
        this.drivers = data.drivers;
        this.drivers.sort((a,b)=>a.totalTimeSeconds - b.totalTimeSeconds);
        this.currentStage = data.currentStage;
        this.player = data.player;
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //now time to sort times and include gap in display
}
