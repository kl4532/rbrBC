import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  difficulty = ['100', '80', '70', '60', '50', '40'];
  surface = ['Mixed', 'Tarmac', 'Gravel', 'Snow'];
  stages = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  tracks: Object[] = [];
  dataUrl: string = '../assets/records.json';
  tracksNum: number = 5;

  // Instead of using ngModule to read input values, maybe I should consider create form. Definitely cleaner approach.

  constructor(private http: HttpClient) { }
  
  ngOnInit() {
    
  }
  generateTracks() {
    this.http.get(this.dataUrl)
      .subscribe((data: Object[])=>{
        this.tracks = this.drawNoRep(data, this.tracksNum);
      })
  }
  drawNoRep(arr: Object[], quantity) {
    let drawed = [];
    let includes = false;
    let loopGuard = 0;

    while(drawed.length<quantity) {
      let track = arr[this.getRandomInt(0, arr.length)];
      for(let i=0; i<drawed.length; i++){
        if(track["Stage"] === drawed[i].Stage) {
          includes = true;
          break
        }
      }
      includes ? 0 : drawed.push(track);
      includes = false; // fuck, i forgot to reset it.. which caused endless loop
      loopGuard++;
      if(loopGuard > 20)break;
    }
    return drawed;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

}


