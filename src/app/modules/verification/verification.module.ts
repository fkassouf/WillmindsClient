import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Route, RouterModule } from "@angular/router";
import { FuseAlertModule } from "@fuse/components/alert";
import { TranslocoModule } from "@ngneat/transloco";
import { OtherpartyRequestDecisionComponent } from './otherparty-request-decision/otherparty-request-decision.component';

const routes: Route[] = [
    {
        path: 'otherparty-request-decision/:token',
        component: OtherpartyRequestDecisionComponent,
    },
];
@NgModule({
    declarations: [
       OtherpartyRequestDecisionComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        TranslocoModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        FuseAlertModule,
        MatProgressSpinnerModule
    ]
})
export class VerificationModule {
}
