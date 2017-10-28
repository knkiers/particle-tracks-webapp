import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundReal'
})
export class RoundRealPipe implements PipeTransform {

  transform(value, numDecimalPlaces: number): any {
    if (typeof value === 'number') {
      return value.toFixed(numDecimalPlaces);
    } else {
      return value;
    }
  }

}
