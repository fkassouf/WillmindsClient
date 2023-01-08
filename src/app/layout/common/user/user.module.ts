import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@ngneat/transloco';
import { UserComponent } from 'app/layout/common/user/user.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        UserComponent
    ],
    imports     : [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatDialogModule,
        MatMenuModule,
        TranslocoModule,
        SharedModule
    ],
    exports     : [
        UserComponent
    ]
})
export class UserModule
{
}
