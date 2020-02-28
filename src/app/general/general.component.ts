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
  players: Driver[];

  ngOnInit() {
    this.subscription = this.srv.getTotalResults()
      .subscribe(data => {
        // console.log(data.settingsForm);
        this.drivers = data.drivers;
        this.drivers.sort((a,b)=>a.totalTimeSeconds - b.totalTimeSeconds);
        this.currentStage = data.currentStage;
        this.players = data.settingsForm.controls.selectedPlayers.value;
      })
    setTimeout(() => {console.log(this.players);}, 1000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //now time to sort times and include gap in display
}
