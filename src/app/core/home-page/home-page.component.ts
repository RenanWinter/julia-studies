import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  categorias = [
    {
      label: 'Matemática',
      childs:[
        {
          label: 'Tabuada'
        }
      ]
    }
  ]

  selected = null

}
