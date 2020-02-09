import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  constructor(private srv: DataService) { }
  selectedTracks;
  tracksForm: FormGroup;
  
  ngOnInit() {
    this.tracksForm = this.srv.getTracks();
    if(this.tracksForm){
      this.selectedTracks = this.tracksForm.value.selectedTracks;
      console.log(this.selectedTracks);
    }
  }



}
