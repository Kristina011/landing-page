import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {WeatherService} from '../weather.service';

interface ForecastData {
  dateString: string;
  temp: number;
}

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
  // forecastData = [];
  //
  // constructor(private weatherService: WeatherService) {
  //   weatherService.getForecast().subscribe(forecastData => {
  //     this.forecastData = forecastData;
  //   });
  // }

  forecast$: Observable<ForecastData[]>;

  constructor(private weatherService: WeatherService) {
    this.forecast$ = weatherService.getForecast();

  }

  ngOnInit() {
  }

}
