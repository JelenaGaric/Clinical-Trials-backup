import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchDTO } from '../DTO/searchDTO';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {

  searchForm = new FormGroup ({
    Condition: new FormControl(''),
    Country:  new FormControl(''),
    Sponsor:  new FormControl('')
  });

  searchDTO: SearchDTO = new SearchDTO();

  constructor() { }

  ngOnInit() {
  }
  onSubmit(){
    this.searchDTO = this.searchForm.value;

    console.log(this.searchDTO);
  }
}
