import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-piece',
  standalone: true,
  imports: [],
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.scss'
})
export class PieceComponent implements OnInit {

  @Input()
  letter: string = ''

  @Input()
  color: string | string[] = ''

  style = ''

  ngOnInit(){
    this.style = `background-color: ${Array.isArray(this.color) ? this.color[0] : this.color}`
    if (Array.isArray(this.color)) {
      this.style += `; color: ${this.color[1]}`
    }
  }

}
