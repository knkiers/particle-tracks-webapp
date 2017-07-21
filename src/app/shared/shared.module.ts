import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputWakeUpDirective } from './directives/input-wake-up.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InputWakeUpDirective
  ],
  exports: [
    InputWakeUpDirective
  ]
})
export class SharedModule { }
