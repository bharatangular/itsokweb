import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterunique'
})
export class FilteruniquePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    
    // Remove the duplicate elements
    // let uniqueArray = value.filter(function (el, index, array) { 
    //   return array.indexOf(el) == index;
    // });
    console.log(value, " i m in pipe")
    
    let uniqueArray = Array.from(new Set(value));
    
    return uniqueArray;
  }

}
