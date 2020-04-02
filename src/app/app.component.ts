import {Component, OnInit} from '@angular/core';
import {timer} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {debounce} from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'protractor-sync-options-plugin-app';
  public longTime = 9001000;

  constructor(private httpClient: HttpClient) {
  }

  public enableInterval() {
    console.log('run interval');
    setInterval(() => console.log('simple interval process tick'), this.longTime);
  }

  public enableTimeout() {
    console.log('run timeout');
    setTimeout(() => console.log('simple timeout done'), this.longTime);

  }

  public runPromise(): Promise<void> {
    console.log('run promise');
    return new Promise((res) => {
      setTimeout(() => {
        console.log('promise with timeout done');
        res();
      }, this.longTime);
    });
  }

  public runObservable() {
    console.log('run observable');
    timer(this.longTime).pipe(tap(() => {
      console.log('observable done');
    })).subscribe();
  }

  public runRequest() {
    console.log('run xhr request');
    // TODO use mock
    this.httpClient.get('https://reqres.in/api/users?delay=30').subscribe((res) => {
      console.log('xhr request done');
    });
  }

  public run3rdPartySetTimeout() {
    console.log('start 3rd party fn');
    const fn = debounce(() => {
      console.log('3rd party fn done');
    }, this.longTime);
    fn();
  }

  public navigateToNonAngular() {
    window.location.assign('http://localhost:4200/non-angular.html');
  }
}


