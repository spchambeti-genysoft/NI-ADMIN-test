import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlphaFilterPipe } from './alpha-filter/alpha-filter.pipe';

@NgModule({
  declarations: [AlphaFilterPipe],
  imports: [CommonModule],
  exports: [AlphaFilterPipe],
})
export class PipesModule {}
