import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { ToastrModule } from 'ngx-toastr';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './core/transloco/custom-mat-paginator-intl';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { mockApiServices } from './mock-api';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent
       ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        ToastrModule.forRoot()
    ],
    providers: [
        {provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl},
        {provide : LocationStrategy , useClass: HashLocationStrategy}

    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
