import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';
import { ApiService } from '../api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

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
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { 
      data: [], 
      label: 'Customer Employees',
      backgroundColor: [
        'red',
        'green',
        'pink',
        'cyan',
      ] 
    }
  ];

  private daysArray = []


  constructor(private api: ApiService) { }

  ngOnInit() {
    this.isLoadingResults = true;
    // Get 5 days from now and store them
    this.setUpDays();
    this.api.getTopCustomers()
      .pipe(
        tap(
          (customerData) => {
            console.log('first observable', customerData);
              customerData.forEach((value, index) => {
                this.getWeatherData(index, value)
              })
          },
          (erro) => console.log('something went wrong')
        )
      )
      .subscribe((res: Array<Customer>) => {
        this.data = res;
        // set the label of the graph
        res.forEach((item: any) => {
          this.barChartLabels.push(item.name)
          this.barChartData[0].data.push(item.employees)
        })
        console.log('data', this.data);
      },
      err => {
        console.log(err); // TODO: handle error
      });
  }

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

  getWeatherData(index: Number, data: Customer) {
    this.isLoadingResults = true;
    this.api.callOpenWeather(data.location)
      .subscribe((res: any) => {
        // console.log('index', index)
        // console.log('weather', res)
        
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
        // set the label of the graph
        // Color the graph based on rain score and 

      },
      err => {
        console.log(err); // TODO: handle error
      });
  }

}
