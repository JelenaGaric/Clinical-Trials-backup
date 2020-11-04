import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SearchService } from '../services/search-service.service';
import { SearchDTO } from '../DTO/searchDTO';
import { Router, ActivatedRoute } from '@angular/router';
import { PageDTO } from '../DTO/pageDTO';
import { Observable } from 'rxjs';

export interface SearchParams {
  condition: string;
  country: string;
  sponsor: string;
  pageNumber: number;
  pageSize: number;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm = new FormGroup ({
    Condition: new FormControl(''),
    Country:  new FormControl(''),
    Sponsor:  new FormControl('')
  });

  searchUri: string;
  
  //searchParams: Observable<SearchParams> = this._route.queryParams.value;

  pageDTO: PageDTO;

  searchDTO: SearchDTO;

  // paged items
  pagedItems: any[];
  searchParams: Partial<SearchParams>;

  constructor( private _searchService: SearchService, 
              private _router: Router, 
              private _route: ActivatedRoute) { }

  ngOnInit() {

    this.pagedItems = [];
    this.searchDTO = new SearchDTO();
    this.pageDTO = new PageDTO();
    this.pageDTO.pageNumber = 1;
    this.pageDTO.pageSize = 10;

    this._route.queryParams.subscribe(value => {
        //if not reloading old search uri
        if(!(value.condition === undefined && value.country === undefined && value.sponsor === undefined)){
         
          this.searchUri = this.makeSearchUri(value);
          
          this._searchService.search(this.searchUri).subscribe(data => {

            this.pagedItems = data.data;
            
            this.pageDTO.pageNumber = data.pageNumber;
            this.pageDTO.firstPage = data.firstPage;
            this.pageDTO.lastPage = data.lastPage;
            this.pageDTO.previousPage = data.previousPage;
            this.pageDTO.nextPage = data.nextPage;
            this.pageDTO.totalPages = data.totalPages;
            this.pageDTO.totalRecords = data.totalRecords;
            
            this._router.navigate([], {
              queryParams: this.searchParams,
              queryParamsHandling: 'merge',
            });

            console.log(this.pagedItems)

            this._searchService.getSearchIds(this.searchDTO).subscribe(data => {
              window.localStorage.setItem("SearchIds", JSON.stringify(data));
              });
          }); 
          
          this.searchDTO.Condition = value.condition;
          this.searchDTO.Country = value.country;
          this.searchDTO.Sponsor = value.sponsor;
          this.searchForm.controls['Condition'].setValue(this.searchDTO.Condition);
          this.searchForm.controls['Country'].setValue(this.searchDTO.Country);
          this.searchForm.controls['Sponsor'].setValue(this.searchDTO.Sponsor);
          
        }
      });
      
  }


  setPage(page: string) {
    //making an uri for next page 
    this.searchUri = "api" + page.split("api")[1] ;
    this._searchService.search(this.searchUri).subscribe(data => {
      this.setPageDTO(data);
    });
  }

  onSubmit(){
    this.searchDTO = this.searchForm.value;
    this.pageDTO.pageNumber = 1;
    
    this.searchParams = {
      condition: this.searchDTO.Condition,
      country: this.searchDTO.Country,
      sponsor: this.searchDTO.Sponsor,
      pageNumber: this.pageDTO.pageNumber,
      pageSize: this.pageDTO.pageSize
    }

    this._router.navigate([], {
      queryParams: this.searchParams,
      queryParamsHandling: 'merge',
    });

  }

  setSearchParams(){
    
  }

  makeSearchUri(params: any): string{
    return "api/StudyStructures/search?condition=" + params.condition + "&Country=" + params.country 
    + "&Sponsor=" + params.sponsor + "&pageNumber=" + params.pageNumber + "&pageSize=" + params.pageSize;
  }

  setPageDTO(data: any){
    this.pagedItems = data.data;
    this.pageDTO.pageNumber = data.pageNumber;
    this.pageDTO.firstPage = data.firstPage;
    this.pageDTO.lastPage = data.lastPage;
    this.pageDTO.previousPage = data.previousPage;
    this.pageDTO.nextPage = data.nextPage;
    this.pageDTO.totalPages = data.totalPages;
    this.pageDTO.totalRecords = data.totalRecords;
    console.log(data);
    this._router.navigate(
      [], 
      {
        relativeTo: this._route,
        queryParams: { pageNumber: this.pageDTO.pageNumber, pageSize: this.pageDTO.pageSize },
        queryParamsHandling: 'merge'
      });
  }
}
