import { Component, Input, OnInit,OnChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit , OnChanges{

  @Input() GpoPpoCpoData : any;
  public chart: any;
  chartData = [100,100,100]
  constructor() { }

  ngOnInit(): void {
    this.createChart()
  }
  updateChartData(newData : any){
   let Checkdataflg= newData.every((data:any)=>{
      return data ==0
    })
  
      if(this.chart){
      
        if(!Checkdataflg){
        this.chart.data.datasets[0].data = newData;
        this.chart.data.datasets[0].backgroundColor = [ '#baa4eb',
        '#78c1be',
        '#bcd6fd',]
        this.chart.data.labels = []
        }
        else {
        
          this.chart.data=     {
            labels: ["No data"],
            datasets: [{
              labels:'No data',
              backgroundColor: ['#D3D3D3'],
              data: [0.001]
            }]
          }
        }
        this.chart.update()
      } 
       
  }
  


  ngOnChanges() {
      if(this.GpoPpoCpoData){
         this.chartData = []       
         this.chartData =[Number(this.GpoPpoCpoData[0]?.totalCpo ? this.GpoPpoCpoData[0]?.totalCpo : 0 ), Number(this.GpoPpoCpoData[0]?.toalGpo ? this.GpoPpoCpoData[0]?.toalGpo : 0), Number(this.GpoPpoCpoData[0]?.totalPpo ? this.GpoPpoCpoData[0]?.totalPpo : 0)];
        this.updateChartData(this.chartData)
    }
  }


  createChart(){
 
    this.chart = new Chart("MyChart", {
      type: 'doughnut', //this denotes tha type of chart
      
      data: {
	       datasets: [{
    label: '',
    data: this.chartData ? this.chartData : [100,100,100],
    
    backgroundColor: [
      '#baa4eb',
      '#78c1be',
      '#bcd6fd',
			
    ],
    hoverOffset: 4
  
  },
  

],

      },
      options: {
        aspectRatio:1.5,
        
      },
      

    },
    
    );


    let Checkdataflg= this.chartData.every((data:any)=>{
      return data ==0
    })
    // alert(Checkdataflg)
    if(Checkdataflg)
    this.updateChartData([0,0,0])

  //   Chart.register({
  //     // plugin implementation
  //     centerDoughnutPlugin : this.centerDoughnutPlugin
  // });
    // this.chart.pluginService.register(this.centerDoughnutPlugin);
  }


   centerDoughnutPlugin = {
    id: "annotateDoughnutCenter",
    beforeDraw: (chart:any) => {
      let width = chart.width;
      let height = chart.height;
      let ctx = chart.ctx;
      
      ctx.restore();
      let fontSize = (height / 114).toFixed(2);
      ctx.font = fontSize + "em sans-serif";
      ctx.textBaseline = "middle";

      let text = "75%";
      let textX = Math.round((width - ctx.measureText(text).width) / 2);
      let textY = height / 1.87;

      console.log("text x: ", textX);
      console.log("text y: ", textY);

      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };

  // Register Donut Plugin

   
}
