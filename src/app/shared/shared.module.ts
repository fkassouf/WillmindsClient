import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { TranslocoModule } from '@ngneat/transloco';
import { OptionsScrollDirective } from './directives/options-scroll.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PagetitleComponent
    ],
    declarations: [
      PagetitleComponent,
      OptionsScrollDirective
    ]
})
export class SharedModule
{
}
