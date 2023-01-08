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

const routes: Route[] = [
    {
        path: 'users-management',
        component: UsersManagementComponent,
    },
    {
        path: 'new-user',
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
        ProfileComponent
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
        FuseCardModule,
        SharedModule
    ]
})
export class AdminModule {
}
