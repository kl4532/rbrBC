import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { version } from '../../package.json';
import {Location} from "@angular/common";
import {fakeAsync, tick} from '@angular/core/testing';
import {Router} from "@angular/router";

import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { GeneralComponent } from './general/general.component';
import { StageComponent } from './stage/stage.component';
import { routes } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let app;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        AppComponent,
        SettingsComponent,
        StageComponent,
        GeneralComponent
      ],
    }).compileComponents();
  }));

  beforeEach(()=>{
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    router = TestBed.get(Router);
    router.initialNavigation();
    location = TestBed.get(Location);

    fixture.detectChanges();

  })

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should display actual version', () => {
    expect(app.version).toEqual(version);
  }) 

  // fit('should navigate to settings on init', fakeAsync(() => { 
  //   // router.navigate(['general']);
  //   tick(1000); 
  //   expect(location.path()).toBe('/settings');
  // }));

  it('navigate to <path> redirects you to /<path>', fakeAsync(() => { 
    router.navigate(['/stage']); 
    tick(); 
    expect(location.path()).toBe('/stage');

    router.navigate(['/settings']); 
    tick(); 
    expect(location.path()).toBe('/settings');
  }));

});
