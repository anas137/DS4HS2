import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrl: './data-display.component.css'
})
export class DataDisplayComponent implements OnInit{
  httpClient = inject(HttpClient);
  data: any[] = [];
  ngOnInit(): void {
    this.fetchData();

  }

  fetchData() {
    this.httpClient.get('https://www.webaudiomodules.com/community/plugins.json').subscribe((data: any) => {
      console.log(data);
      this.data = data;
      

    });
  }
  
}
