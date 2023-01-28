import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config';
import { TranslocoService } from '@ngneat/transloco';
import { AppConfig, Themes } from 'app/core/config/app.config';
import { Layout } from 'app/layout/layout.types';
import { Subject, takeUntil } from 'rxjs';
import { MediationsFilter } from '../models/mediations-filter';
import { MediationService } from '../services/mediation.service';

@Component({
  selector: 'mediations-filter',
  templateUrl: './mediations-filter.component.html',
  styles: [
    `
        settings {
            position: static;
            display: block;
            flex: none;
            width: auto;
        }

        @media (screen and min-width: 1280px) {

            empty-layout + settings .settings-cog {
                right: 0 !important;
            }
        }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class MediationsFilterComponent implements OnInit, OnDestroy {
    @Output() filterMediations = new EventEmitter<MediationsFilter>();
    @ViewChild('filterDrawer', {static: false}) filterDrawer: any;
    config: AppConfig;
    layout: Layout;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    position = 'right';
    statuses : any[] = [];
 
    filterForm : FormGroup;

     /**
     * Constructor
     */
     constructor(
      private _router: Router,
      private _fuseConfigService: FuseConfigService,
      public _translocoService : TranslocoService,
      private mediationService : MediationService,
      private formBuilder : FormBuilder
    ){
        this.filterForm = this.formBuilder.group({
          caseNumber : new FormControl<string>(null, []),
          statusId : new FormControl<number>(null, []),
          requesterName : new FormControl<string>(null, []),
          fromDate : new FormControl<Date>(null, []),
          toDate : new FormControl<Date>(null, []),
        })
    }

    // -----------------------------------------------------------------------------------------------------
      // @ Lifecycle hooks
      // -----------------------------------------------------------------------------------------------------

      /**
       * On init
       */
      ngOnInit(): void
      {
         // Subscribe to config changes
         this._fuseConfigService.config$
         .pipe(takeUntil(this._unsubscribeAll))
         .subscribe((config: AppConfig) => {

             // Store the config
             this.config = config;
         });

        /*On language change*/
        this._translocoService.langChanges$.subscribe(lang=>{
            this.position = lang === 'ar'? 'left' : 'right';
        });

        this.getMediationStatusList();
      }

      /**
       * On destroy
       */
      ngOnDestroy(): void
      {
          // Unsubscribe from all subscriptions
          this._unsubscribeAll.next(null);
          this._unsubscribeAll.complete();
      }

      getMediationStatusList()
      {
        this.mediationService.getMediationStatusList().subscribe(resp=>{
            if(resp.success)
            {
              this.statuses = resp.result;
            }
        });
      }

      get f()
      {
        return this.filterForm.controls;
      }

      toggleFilter()
      {
         this.filterDrawer?.toggle();
      }

      clearFilter(){
        this.filterForm.reset();
        this.filterMediations.emit(this.filterForm.value);
        this.toggleFilter();
      }

      submitSearch()
      {
        this.filterMediations.emit(this.filterForm.value);
        this.toggleFilter();
      }


}
