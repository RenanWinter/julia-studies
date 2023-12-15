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
      description: 'Matemática é uma ferramenta que ajuda a compreender o mundo!',
      image: 'math.webp',
      class: '',
      actions:[
        {
          label: 'Divisão',
          router: 'matematica/divisao',
          class: 'btn btn-primary'
        },
        {
          label: 'Multiplicação',
          router: 'matematica/multiplicacao',
          class: 'btn btn-primary'
        },
        {
          label: 'Tabuada',
          router: 'matematica/tabuada',
          class: 'btn btn-primary'
        },

      ]
    },
    {
      label: 'Jogos',
      description: 'Vamos exercitar a mente?',
      image: 'games.png',
      class: '',
      actions:[
        {
          label: 'Senha',
          router: 'jogos/password',
          class: 'btn btn-primary'
        }
      ]
    },
  ]

}
