import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './app-routing.module';
import { SearchComponent } from './search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchService } from './services/search-service.service';
import { HttpClientModule } from '@angular/common/http';
import { StudyViewComponent } from './study-view/study-view.component';
import { DndModule } from 'ngx-drag-drop';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    SearchComponent,
    StudyViewComponent,
    AdvancedSearchComponent,
    StatisticsComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DndModule
  ],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
