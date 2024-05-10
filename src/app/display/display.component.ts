import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [RouterOutlet, NgFor ,HttpClientModule, RouterModule,FormsModule,NgIf],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent implements OnInit {
  originalData: any[] = [];
  allData: any[] = [];
  data: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalFound: number = 0; // Total number of plugins found
  searchQuery = '';

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllData();
    // Optionally  
  }

  fetchAllData() {
    this.httpClient.get<any[]>('https://www.webaudiomodules.com/community/plugins.json').subscribe(response => {
      if (response && response.length > 0) {
        this.originalData = response;
        this.allData = [...this.originalData];
        this.totalPages = Math.ceil(this.allData.length / this.pageSize);
        this.totalFound = this.allData.length; // Set the found count to total initially
        this.updatePage(1);
      } else {
        console.error('No data returned from the server');
      }
    }, error => {
      console.error('Error fetching data:', error);
    });
  }

  updatePage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.data = this.allData.slice(startIndex, endIndex);
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.updatePage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.updatePage(this.currentPage - 1);
    }
  }

  sortByName() {
    this.allData.sort((a, b) => a.name.localeCompare(b.name));
    this.updatePage(1);
  }

  sortByNameZ() {
    this.allData.sort((a, b) => b.name.localeCompare(a.name));
    this.updatePage(1);
  }

  sortByVendor() {
    this.allData.sort((a, b) => a.vendor.localeCompare(b.vendor));
    this.updatePage(1);
  }

  resetFilter() {
    this.searchQuery = ''; // Clear the search input
    this.allData = [...this.originalData]; // Reset to original data
    this.totalFound = this.allData.length; // Update the total found count
    this.updatePage(1); // Refresh the page display
}
  searchPlugins() {
    if (this.searchQuery) {
      this.allData = this.originalData.filter(plugin => 
        plugin.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        plugin.vendor.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.allData = [...this.originalData];
    }
    this.totalFound = this.allData.length; // Update the count based on the search result
    this.updatePage(1);
  }

  handleSearchChange(query: string) {
    this.searchQuery = query;
    this.searchPlugins();
  }
}