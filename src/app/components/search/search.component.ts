import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent{

  constructor(private router: Router) {
  }

  doSearch(myInput: string) {
    this.router.navigateByUrl(`/search/${myInput}`).then(success => {
      if (success) {
        console.log('Search Navigation succeeded!');
      } else {
        console.log('Search Navigation failed!');
      }
    }).catch(error => {
      console.error('Search Navigation error:', error);
    });
  }
}
