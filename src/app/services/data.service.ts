import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, throwIfEmpty } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { crashReporter } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  settings: FormGroup;
  setSettings(data) {
    this.settings = data;
  }
  getSettings() {
    return this.settings;
  }
  getDrivers(category){
    return this.http.get('../../assets/drivers.json')
      .pipe(
        map(cat => cat[category]
        )
      );
  }
  timeToSeconds(time: string): number {
    return parseInt(time.substring(0,2))*60 + parseFloat(time.substring(3));
  }
  timeToString(time:number) {
    let minutes: any = (time/60) | 0;
    let seconds = time%60
    minutes<10 ? minutes = "0" + minutes  : 0;
    return  minutes + ":" + seconds.toFixed(2);
  }

  setStageTimes(talent, stage) {
    let timeSeconds;
    let crash: boolean;
    let difficulty = this.settings.controls.difficulty.value;

    console.log(difficulty);

    switch (talent) {
      case 1:
        timeSeconds = this.timeToSeconds(stage.record)*(200-difficulty)/100*this.getRandomInt(100,110)/100;
        crash = this.getRandomInt(1,100) > 99 ? true : false;
        break;
      case 2:
        timeSeconds = this.timeToSeconds(stage.record)*(200-difficulty)/100*this.getRandomInt(105,120)/100
        crash = this.getRandomInt(1,100) > 98 ? true : false;
        break;
      case 3:
        timeSeconds = this.timeToSeconds(stage.record)*(200-difficulty)/100*this.getRandomInt(110,130)/100
        crash = this.getRandomInt(1,100) > 97 ? true : false;
        break;        
    
      default:
        break;
    }

    return {
      name: stage.stage,
      timeSeconds: timeSeconds,
      timeString: this.timeToString(timeSeconds),
      crash: crash
    }
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
}
