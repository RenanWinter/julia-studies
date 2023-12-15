import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgParticlesModule } from 'ng-particles';
import { confetti } from 'tsparticles-confetti';
import { PieceComponent } from './piece/piece.component';

@Component({
  selector: 'app-senha',
  standalone: true,
  imports: [CommonModule, PieceComponent, NgParticlesModule],
  templateUrl: './senha.component.html',
  styleUrl: './senha.component.scss'
})
export class SenhaComponent implements OnInit {

  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  colors = [['red', 'white'], ['blue', 'white'], 'green', 'yellow', 'orange', ['purple', 'white'], 'pink', ['brown', 'white'], ['gray', 'white'], ['black', 'white']]

  size = 4
  options = 4
  attempts = 10

  type: 'Letters' | 'Numbers' = 'Letters'
  canRepeat = false
  password = ''
  winner = false
  looser = false

  roundGuess: { letter: string, color: string | string[] }[] = []

  currentOptions: string[] = []
  rounds: {
    guess: { letter: string, color: string | string[] }[],
    result: { correct: number, incorrect: number, invalids: number },
    played: boolean
  }[] = []

  generatePassword() {
    this.password = ''
    this.currentOptions = [...(this.type === 'Letters' ? this.letters : this.numbers)].slice(0, this.options)
    let availables = [...this.currentOptions]
    for (let i = 0; i < this.size; i++) {
      const index = Math.floor(Math.random() * availables.length)
      this.password += availables[index]
      !this.canRepeat && availables.splice(index, 1)
    }
  }

  startGame() {
    this.generatePassword()
    this.winner = false
    this.looser = false
    this.roundGuess = Array(this.size).fill({ letter: '?', color: 'light-gray' })
    this.rounds = Array(this.attempts).fill({
      guess: Array(this.size).fill({ letter: '?', color: 'light-gray' }),
      result: { correct: 0, incorrect: 0, invalids: 0},
      played: false,
    })
    console.log(this.password)
  }

  selectOption(option: string) {
    if ([this.winner, this.looser].includes(true)){
      return
    }
    let index = this.currentOptions.indexOf(option)
    const letter = this.currentOptions[index]
    const color = this.colors[index]
    let next = this.roundGuess.findIndex(item => item.letter === '?')
    if (next === -1) {
      next = this.roundGuess.length - 1
    }
    this.roundGuess[next] = { letter, color }
  }

  checkGuess() {
    let corrects = 0
    let incorrects = 0
    this.roundGuess.forEach((item, index) => {
      if (item.letter === this.password[index]) {
        corrects++
      } else if (this.password.includes(item.letter)) {
        incorrects++
      }
    })

    const result = {
      correct: corrects,
      incorrect: incorrects,
      invalids: this.size - corrects - incorrects
    }

    this.rounds[this.rounds.findIndex(item => !item.played)] = {
      guess: this.roundGuess,
      result,
      played: true
    }

    this.roundGuess = Array(this.size).fill({ letter: '?', color: 'light-gray' })
    if (corrects === this.size) {
      this.winner = true
      this.playAnimation()
    }

    if (this.rounds.filter(item => item.played).length === this.attempts && !this.winner) {
      this.looser = true
    }
  }

  async playAnimation() {
    const interval = setInterval(() => {
      confetti('tsparticles', {});
    }, 400)

    setTimeout(() => {
      clearInterval(interval)
    }, 850);

  }

  ngOnInit(): void {
    this.startGame()
  }

}
