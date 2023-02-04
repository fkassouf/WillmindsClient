import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTableModule } from "@angular/material/table";
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseCardModule } from '@fuse/components/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { SuperAdminGuard } from 'app/core/auth/guards/superadmin.guard';
import { MatSelectModule } from '@angular/material/select';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatSelectSearchModule } from 'mat-select-search';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MediationCaseComponent } from './mediation-case/mediation-case.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialFileInputModule, NGX_MAT_FILE_INPUT_CONFIG } from 'ngx-material-file-input';
import { config } from 'app/core/models/file-input-config';
import { MediationsComponent } from './mediations/mediations.component';
import { MediationsFilterComponent } from './mediations-filter/mediations-filter.component';
import { ConfirmSubmissionComponent } from './confirm-submission/confirm-submission.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MediationFlowComponent } from './mediation-flow/mediation-flow.component';
import { StatementOfReplyComponent } from './statement-of-reply/statement-of-reply.component';

const routes: Route[] = [
    {
        path: 'mediation-case/:id',
        component: MediationCaseComponent,
    },
    {
        path: 'mediation-flow/:id',
        component: MediationFlowComponent,
    },
    {
        path: 'mediations',
        component: MediationsComponent,
    },
];

@NgModule({
    declarations: [
     MediationCaseComponent,
     MediationsComponent,
     MediationsFilterComponent,
     ConfirmSubmissionComponent,
     MediationFlowComponent,
     StatementOfReplyComponent
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
        MatStepperModule,
        MatRadioModule,
        MatTabsModule,
        MatDatepickerModule,
        MatRadioModule,
        FuseDrawerModule,
        MaterialFileInputModule,
        MatTooltipModule,
        FuseDrawerModule,
        MatDialogModule,
        SharedModule
    ],
    providers: [{ provide: NGX_MAT_FILE_INPUT_CONFIG, useValue: config }]
})
export class MediationModule {
}
