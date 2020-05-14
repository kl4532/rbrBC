import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings.component';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from '../services/data.service';
import { of } from 'rxjs';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let srv: DataService;

  let elements = {
    btnGenerate: () => document.body.querySelector('#generate') as HTMLInputElement,
    btnSubmit: () => document.body.querySelector('.btn-submit') as HTMLInputElement,
  }

  const mockResults: Object[] = [
    {stage: "Test", length: 3.5, surface: "Tarmac", record: "02:23.88", country: "Japan"}, 
    {stage: "Test II", length: 3.5, surface: "Tarmac", record: "02:25.77", country: "Japan"}
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ SettingsComponent ]
      ,
      providers: [
          DataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    srv = TestBed.get(DataService);
    spyOn(srv, 'filterStages').and.returnValue(of(mockResults))
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate tracks', () => {
    elements.btnGenerate().click();
    fixture.detectChanges();
    expect(component.generated).toBeTruthy();
  });

  it('should submit and set settings', () => {
    spyOn(srv, 'setSettings').and.callThrough();

    elements.btnGenerate().click();
    fixture.detectChanges();

    elements.btnSubmit().click();
    fixture.detectChanges();
    
    expect(srv.setSettings).toHaveBeenCalled();
  })
});
