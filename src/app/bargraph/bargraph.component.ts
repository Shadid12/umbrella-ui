import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';
import { ApiService } from '../api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { tap, map } from 'rxjs/operators';
import * as moment from 'moment';
import { forkJoin, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-bargraph',
  templateUrl: './bargraph.component.html',
  styleUrls: ['./bargraph.component.sass']
})
export class BargraphComponent implements OnInit {

  data: Array<any> = [];
  isLoadingResults = true;


  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['','','',''];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public graphLoaded = true;
  private thirdSubscription: Subscription;
  private weatherDataSubs: Subscription;

  public barChartData: ChartDataSets[] = [
    { 
      data: [null, null , null, null], 
      label: 'Customer Employees',
      backgroundColor: [null, null , null, null]
    }
  ];

  private daysArray = []


  constructor(private api: ApiService) { }

  ngOnInit() {
    this.isLoadingResults = true;
    // Get 5 days from now and store them
    this.setUpDays();
    this.api.getTopCustomers()
      .subscribe((res: any) => {
        this.data = res;
        console.log('Done', this.data);
        this.thirdSubscription = this.simpleObservable.subscribe();
      })
  }

  ngOnDestroy() {
    this.thirdSubscription.unsubscribe();
  }
  public simpleObservable = new Observable((observer) => {
    
    // observable execution
    if(this.data.length > 0) {
      console.log('Data Found')
      let observableBatch = [];
      this.data.forEach((item: any, index:any) => {
        this.api.callOpenWeather(item.location).subscribe((res: any) => {
          console.log('--->>>', res)
          this.barChartLabels[index] = item.name
          this.barChartData[0].data[index] = item.employees

          // Loop the days array
          const weather = res.list
          let weatherByDay = []
          let rainScore = 0;
          this.daysArray.forEach((day: string) => {
            // Get all weather data for this day
            weatherByDay = weather.filter((item) => {
              if(day === item.dt_txt.split(' ')[0]) {
                return item;
              }
            })
            console.log('weather By Day', weatherByDay)
            // check if its going to rain today
            let rainCount = weatherByDay.filter((dayy) => {
            if(dayy.rain) {
              return dayy;
            } 
            })
            if(rainCount.length > 0) {
              rainScore++;
            }
          })

        console.log('check rain score', rainScore)
        if(rainScore >= 5) {
          this.barChartData[0].backgroundColor[index] = 'green';
        } else {
          this.barChartData[0].backgroundColor[index] = 'red';
        }
        })
      })
      observer.next("bla bla bla")
      observer.complete()
    }
  })

  private setUpDays() {
    let today = moment(new Date()).format("YYYY-MM-DD");
    let daysArray = [];
    daysArray.push(today);
    for (let i = 0; i < 4; i++) {
      let tomorrow = moment(today).add(1, 'days').format("YYYY-MM-DD");
      daysArray.push(tomorrow);
      today = tomorrow;
    }
    this.daysArray = daysArray;
  }

}
