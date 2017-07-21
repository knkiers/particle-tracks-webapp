import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundReal'
})
export class RoundRealPipe implements PipeTransform {

  transform(value: number, numDecimalPlaces: number): any {
    console.log(value);
    return value.toFixed(numDecimalPlaces);
  }

}
