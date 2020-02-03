import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormArray, FormBuilder} from '@angular/forms';

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
  allTracks: Object[] = [];
  dataUrl: string = '../assets/records.json';

  settingsForm: FormGroup;
  constructor(private http: HttpClient, private fb:FormBuilder) { 
  }
  
  ngOnInit() {
    this.settingsForm = new FormGroup({
      difficulty: new FormControl('50'),
      surface: new FormControl('Mixed'),
      lMin: new FormControl('3'),
      lMax: new FormControl('8'),
      stages: new FormControl('5'),
      // tracks: this.fb.array([]) ,
    });
  }

  generateTracks() {
    this.http.get(this.dataUrl)
      .subscribe((data: Object[])=>{
        let stages = this.settingsForm.controls.stages.value;
        this.allTracks = data;
        this.tracks = this.drawNoRep(data, stages);
        this.tracks.forEach((track, index)=>{
          this.settingsForm.addControl(`${index}`, new FormControl(`${track['Stage']}`));
        })
      })
  }

  onSubmit() {
    console.log(this.settingsForm);
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
          loopGuard++;
          break
        }
      }
      includes ? 0 : drawed.push(track);
      includes = false; // fuck, i forgot to reset it.. which caused endless loop
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


