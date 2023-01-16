import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTableModule } from "@angular/material/table";
import { UsersManagementComponent } from './users-management/users-management.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NewUserComponent } from './new-user/new-user.component';
import { ProfileComponent } from './profile/profile.component';
import { FuseCardModule } from '@fuse/components/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { SuperAdminGuard } from 'app/core/auth/guards/superadmin.guard';
import { MatSelectModule } from '@angular/material/select';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatSelectSearchModule } from 'mat-select-search';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { UserFilterComponent } from './user-filter/user-filter.component';
import { FuseDrawerModule } from '@fuse/components/drawer';

const routes: Route[] = [
    {
        path: 'users-management',
        canActivate : [SuperAdminGuard],
        component: UsersManagementComponent,
    },
    {
        path: 'new-user',
        canActivate : [SuperAdminGuard],
        component: NewUserComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent,
    }
];

@NgModule({
    declarations: [
        UsersManagementComponent,
        NewUserComponent,
        ProfileComponent,
        UserFilterComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslocoModule,
        SharedModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatTooltipModule,
        MatSelectModule,
        MatSelectSearchModule,
        MatCheckboxModule,
        FuseCardModule,
        NgxIntlTelInputModule,
        NgxDropzoneModule,
        MatDatepickerModule,
        MatMomentDateModule,
        FuseDrawerModule,
        SharedModule
    ]
})
export class AdminModule {
}
