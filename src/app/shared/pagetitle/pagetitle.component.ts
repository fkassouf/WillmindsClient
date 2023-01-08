import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pagetitle',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.scss']
})
export class PagetitleComponent implements OnInit {

  @Input()
  breadcrumbItems!: Array<{
    active?: boolean;
    label?: string;
    url? : string
  }>;

  @Input() title: string | undefined;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(url : string)
  {
      this.router.navigate([url]);
  }

}
