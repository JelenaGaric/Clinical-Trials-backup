import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SearchComponent } from './search/search.component';
import { StudyViewComponent } from './study-view/study-view.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
    { path: "", component: SearchComponent, pathMatch: "full" },
    { path: "search",
    children: [
      {
        path: '?**',
        component: SearchComponent,
      },
    ],
     component: SearchComponent,  pathMatch: "full" },
     { path: "advanced-search", component: AdvancedSearchComponent, pathMatch: "full" },
     { path: "statistics", component: StatisticsComponent, pathMatch: "full" },
     { path: 'study/:id', component: StudyViewComponent },
     { path: 'test', component: TestComponent },
    { path: "**", redirectTo: '/search' }
];

@NgModule({  
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule {
}