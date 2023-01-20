import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

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
    constructor(private router : Router)
    {
    }

    ngOnInit() : void {
        this.breadCrumbItems = [
             { label: 'Home', active: true, url : '/' }
          ];
    }

    requestMediation()
    {
        this.router.navigate(['/mediation/mediation-case']);
    }
}
