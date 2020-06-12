import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, filter, map, mergeMap, pluck, retry, share, switchMap, tap, toArray} from 'rxjs/operators';
import {NotificationsService} from '../notifications/notifications.service';

interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    }
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient, private notificationService: NotificationsService) { }

  getForecast() {
    return this.getCurrentLocation()
      .pipe(
        map(coords => {
          return new HttpParams()
            .set('lat', String(coords.latitude))
            .set('lon', String(coords.longitude))
            .set('units', 'metric')
            .set('appid', '06a0ce33586922f1ebfa61995a644b28');
        }),
        switchMap(params => this.http.get<OpenWeatherResponse>(this.url, { params })
        ),
        pluck('list'),
        mergeMap(value => of(...value)),
        filter((value, index) => index % 8 === 0),
        map(value => {
          return {
            dateString: value.dt_txt,
            temp: value.main.temp
          };
        }),
        toArray(),
        share(),
        tap(
          () => {
            this.notificationService.addSuccess('Got your weather forcast');
          }
        ),
        catchError((err) => {
          this.notificationService.addError('Failed to get weather on your location');

          return throwError(err);
        })
      );
  }

  getCurrentLocation() {
    return new Observable<Coordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position.coords);
          observer.complete();
        },
        (err) => observer.error(err)
      );
    }).pipe(
      retry(1),
      tap(
        () => {
        this.notificationService.addSuccess('Got your location');
        }
      ),
      catchError((err) => {
        this.notificationService.addError('Failed to get your location');

        return throwError(err);
      })
    );
  }
}
