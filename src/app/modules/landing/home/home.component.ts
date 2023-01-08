import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent implements OnInit
{
    breadCrumbItems!: Array<{}>;
    title : string = 'Home';
    /**
     * Constructor
     */
    constructor()
    {
    }

    ngOnInit() : void {
        this.breadCrumbItems = [
             { label: 'Home', active: true, url : '/customers/customer-subscription-form' }
          ];
    }
}
