import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  constructor(private srv: DataService) { }

  ngOnInit() {
  }
}
