import { Component, inject, OnInit, signal } from '@angular/core';
import { Box } from '../../../../core/models/box';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BoxService } from '../../../../core/services/box.service';

@Component({
  selector: 'app-box-details',
  imports: [CommonModule],
  templateUrl: './box-details.component.html',
  styleUrl: './box-details.component.css'
})
export class BoxDetailsComponent implements OnInit{
  private boxService = inject(BoxService);
  box = signal<Box | null>(null);
  
  route = inject(ActivatedRoute)

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');  
  
    if(idParam){
     this.loadBox(idParam)
    }
  }

  loadBox(id: string) {
    this.boxService.getById(id).subscribe({
      next: (data) => {
        this.box.set(data);
      },
      error: (err) => {
          console.log("Error al obtener box: " + err)
      }
    });
  }

}
