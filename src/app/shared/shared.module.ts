import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputWakeUpDirective } from './directives/input-wake-up.directive';
import { RoundRealPipe } from './pipes/round-real.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InputWakeUpDirective,
    RoundRealPipe
  ],
  exports: [
    InputWakeUpDirective,
    RoundRealPipe
  ]
})
export class SharedModule { }
