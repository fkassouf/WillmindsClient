import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config';
import { TranslocoService } from '@ngneat/transloco';
import { AppConfig, Themes } from 'app/core/config/app.config';
import { Layout } from 'app/layout/layout.types';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../admin.service';
import { UsersFilter } from '../models/user-filter';

@Component({
  selector: 'user-filter',
  templateUrl: './user-filter.component.html',
  styles       : [
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

export class UserFilterComponent implements OnInit, OnDestroy {
    @Output() searchClick : EventEmitter<any> = new EventEmitter();
    @ViewChild('filterDrawer') filterDrawer : any;
    config: AppConfig;
    layout: Layout;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    position : string = 'right';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    roles : any[];
    fullName : any;
    email : any;
    role : any;
    /**
     * Constructor
     */
    constructor(
      private _router: Router,
      private _fuseConfigService: FuseConfigService,
      public _translocoService : TranslocoService,
      private adminService : AdminService
  )
  {
    this._translocoService.langChanges$
    .subscribe((lang) => {
      this.position = lang === 'ar'? 'left' : 'right';
    });
  }

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

          this.getRoles();
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

  getRoles()
     {
       this.adminService.getRoles().subscribe(resp=>{
         if(resp.success)
         {
            this.roles = resp.result;
         }
       })
     }

     search()
     {
      let filter : UsersFilter = {
        email : this.email,
        fullName: this.fullName,
        role : this.role
      };
      this.searchClick.emit(filter);
      this.filterDrawer.close();
     }

     clearFilter()
     {
      this.fullName = null;
      this.email = null;
      this.role = null;
      let filter : UsersFilter = {
        email : this.email,
        fullName: this.fullName,
        role : this.role
      };
      this.searchClick.emit(filter);
      this.filterDrawer.close();
     }
}
