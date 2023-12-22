import { Component, Input, OnInit } from '@angular/core';
import { PensionServiceService } from 'src/app/services/pension-service.service';

@Component({
  selector: 'app-admin-query',
  templateUrl: './admin-query.component.html',
  styleUrls: ['./admin-query.component.scss']
})
export class AdminQueryComponent implements OnInit {
  sqlQuery:any
  constructor(private _service:PensionServiceService) { }
   dataMessageResults: any[]=[];
   modulelist:any[]=[];
   moduleName:any='3';
   queryType:any='1';
   queryTypeList:any;
  ngOnInit(): void {
    this.getwfmodule();
    this.getQueryType();
    this.getHeaders()
  }
  getQueryType()
  {
    var data =[{
      "name": "Select Type Action",
      "id": "1"
    },{
      "name": "Other Type Action",
      "id": "2"
    },
    {
      "name": "SP Compile",
      "id": "3"
    }
    
  ] 
  this.queryTypeList=data;
  }
  isSP:boolean=false;
  QueryActionChange()
  {
    if(this.queryType==3)
    {
     
      this.isSP=true;
      this.sqlQuery="CREATE OR REPLACE PROCEDURE your_procedure_name AS BEGIN ... END;";
    }else
    {
      this.isSP=true;
      this.sqlQuery="";
    }
  }
  getHeaders() {
    let headers: string[] = [];
    if(this.dataMessageResults) {
      this.dataMessageResults.forEach((value) => {
        Object.keys(value).forEach((key) => {
          if(!headers.find((header) => header == key)){
            headers.push(key)
          }
        })
      })
    }
    return headers;
  }
  getwfmodule() {
    //var url = "getwfprocess";
    var data =[{
      "name": "Pension",
      "id": "3"
    },{
      "name": "Employee",
      "id": "1"
    },
    {
      "name": "Payee",
      "id": "3"
    }
    
  ]

        this.modulelist = data;
        console.log(this.modulelist)
        
  }
  convertintoString(data:any)
  {
    if(typeof(data)=='object')
    {
      return JSON.stringify(data)
    }
    else {
      return data
    }
    
    
  }
  submit()
  {
    this.dataMessageResults=[];
    let data:any;
    if(this.queryType!=3)
    {
      
    
  if(this.queryType==1)
  {
     data={
      "sql":this.sqlQuery,
      "databaseKey":this.moduleName,
      "action":this.queryType,
      "req":""
    }
  }else
  {
    data={
      "sql":"",
      "databaseKey":this.moduleName,
      "action":this.queryType,
      "req":this.sqlQuery
    }
  }

console.log(data)
  
    this._service.getUpcomPsnReport('getdata', data).subscribe((res: any) => {
      res=JSON.parse(res)
  
      
    console.log(res)
       if(res.data!='')
       {
        if(this.queryType=="1")
        {
                  this.dataMessageResults = JSON.parse(res.data);
        }else{
       this.dataMessageResults.push(JSON.parse(res.data))
          
        } 
       }else
       {
        this.dataMessageResults=[];
       }
      
    })
  
  }else
  {
    data={
      "sql":this.sqlQuery,
      "databaseKey":this.moduleName      
    }
    console.log(data)
  
    this._service.postNewEsign('callstoreprocedure', data).subscribe((res: any) => {
      res=JSON.parse(res)
  
      
    console.log(res)
       if(res.data!='')
       {
       
       this.dataMessageResults.push(JSON.parse(res.data))
          
        
       }else
       {
        this.dataMessageResults=[];
       }
      
    })
  }
}
}
