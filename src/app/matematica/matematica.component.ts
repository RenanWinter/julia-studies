import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgParticlesModule } from 'ng-particles';
import { confetti } from 'tsparticles-confetti';
import { Container } from 'tsparticles-engine';

@Component({
  selector: 'app-matematica',
  standalone: true,
  imports: [CommonModule, FormsModule, NgParticlesModule],
  templateUrl: './matematica.component.html',
  styleUrl: './matematica.component.scss'
})
export class MatematicaComponent {

  @Input()
  operacao: string = ''

  materia: any
  operador = '+'
  resposta = ''
  rounds = 0

  number1 = 0
  number2 = 0
  startedAt: Date | null = null
  endedAt: Date | null = null
  resultTime = ''

  answerType: 'C' | 'I' | '' = ''
  correctResult = 0
  showScoreboard = true
  scoreboard = {
    corrects: 0,
    incorrects: 0,
    total: 0,
    totalTime: 0,
    playTime: '',
    averageTime: '',
    fastest: 0,
    slowest: 0,
    fastestTime: '',
    slowestTime: '',
    correctsTotal: 0,
    correctsTotalTime: '',
    fastestCorrect: 0,
    fastestCorrectTime: '',
    slowestCorrect: 0,
    slowestCorrectTime: '',
    incorrectsTotal: 0,
    incorrectsTotalTime: '',
    fastestIncorrect: 0,
    fastestIncorrectTime: '',
    slowestIncorrect: 0,
    slowestIncorrectTime: '',
  }

  tabuadas = Array.from(Array(10).keys()).map(i => i + 1);

  tabuadasSelecionadas: number[] = []

  private container?: Container;
  constructor(private elementRef: ElementRef<HTMLElement>) { }

  materias = [
    { name: 'tabuada', label: 'tabuada', operator: 'X' },
    { name: 'multiplicacao', label: 'multiplicação', operator: 'X' },
    { name: 'divisao', label: 'divisão', operator: '' },

  ]


  getTimeInMS() {
    if (!this.startedAt) return 0
    this.endedAt = new Date()
    return this.endedAt.getTime() - this.startedAt?.getTime()
  }

  convertTimeInMSToHumanReadable(timeInMS: number) {
    return new Date(Math.abs(timeInMS)).toISOString().substr(11, 8)
  }

  correctAnswer() {
    this.answerType = 'C'
    this.playAnimation()
  }

  incorrectAnswer() {
    this.answerType = 'I'
  }

  updateScoreBoard(time: number, resultType: 'C' | 'I') {
    this.scoreboard.totalTime += time;
    this.scoreboard.total++;
    resultType === 'C' && (this.scoreboard.corrects++)
    resultType === 'I' && (this.scoreboard.incorrects++)
    this.scoreboard.playTime = this.convertTimeInMSToHumanReadableSimple(this.scoreboard.totalTime)
    this.scoreboard.averageTime = this.convertTimeInMSToHumanReadableSimple(this.scoreboard.totalTime / this.scoreboard.total)

    if (this.scoreboard.fastest === 0 || time < this.scoreboard.fastest) {
      this.scoreboard.fastest = time
      this.scoreboard.fastestTime = this.convertTimeInMSToHumanReadableSimple(time)
    }

    if (this.scoreboard.slowest === 0 || time > this.scoreboard.slowest) {
      this.scoreboard.slowest = time
      this.scoreboard.slowestTime = this.convertTimeInMSToHumanReadableSimple(time)
    }

    if (resultType === 'C') {

      this.scoreboard.correctsTotal += time
      this.scoreboard.correctsTotalTime = this.convertTimeInMSToHumanReadableSimple(this.scoreboard.correctsTotal)

      if (this.scoreboard.fastestCorrect === 0 || time < this.scoreboard.fastestCorrect) {
        this.scoreboard.fastestCorrect = time
        this.scoreboard.fastestCorrectTime = this.convertTimeInMSToHumanReadableSimple(time)
      }

      if (this.scoreboard.slowestCorrect === 0 || time > this.scoreboard.slowestCorrect) {
        this.scoreboard.slowestCorrect = time
        this.scoreboard.slowestCorrectTime = this.convertTimeInMSToHumanReadableSimple(time)
      }
    }

    if (resultType === 'I') {

      this.scoreboard.incorrectsTotal += time
      this.scoreboard.incorrectsTotalTime = this.convertTimeInMSToHumanReadableSimple(this.scoreboard.incorrectsTotal)

      if (this.scoreboard.fastestIncorrect === 0 || time < this.scoreboard.fastestIncorrect) {
        this.scoreboard.fastestIncorrect = time
        this.scoreboard.fastestIncorrectTime = this.convertTimeInMSToHumanReadableSimple(time)
      }

      if (this.scoreboard.slowestIncorrect === 0 || time > this.scoreboard.slowestIncorrect) {
        this.scoreboard.slowestIncorrect = time
        this.scoreboard.slowestIncorrectTime = this.convertTimeInMSToHumanReadableSimple(time)
      }
    }

  }

  responder() {
    const respondido = +this.resposta
    this.correctResult = 0
    if (this.materia.name === 'tabuada' || this.materia.name === 'multiplicacao') {
      this.correctResult = this.number1 * this.number2
    } else if (this.materia.name === 'divisao') {
      this.correctResult = this.number1 / this.number2
    }
    const correct = respondido === this.correctResult
    const time = this.getTimeInMS()
    this.updateScoreBoard(time, correct ? 'C' : 'I')
    this.resultTime = this.convertTimeInMSToHumanReadable(time)
    localStorage.setItem('scoreboard-' + this.materia.name, JSON.stringify(this.scoreboard))
    correct && this.correctAnswer()
    !correct && this.incorrectAnswer()

  }

  toggleScoreboard() {
    this.showScoreboard = !this.showScoreboard
    localStorage.setItem('showScoreboard', JSON.stringify(this.showScoreboard))
  }

  restart() {
    const stored = localStorage.getItem('lastNumbers-' + this.materia.name)
    if (this.rounds === 0 && stored) {
      const lastNumbers = JSON.parse(stored)
      this.number1 = lastNumbers.number1
      this.number2 = lastNumbers.number2
    } else if (this.materia.name === 'divisao') {
      this.number2 = this.getRandomBetween(2, 10)
      this.number1 = this.getDivisibleBy(this.number2, 80, 9999)

    } else if (this.materia.name === 'multiplicacao') {
      this.number1 = this.getRandomBetween(2, 999)
      this.number2 = this.getRandomBetween(2, 10)
    } else if (this.materia.name === 'tabuada') {
      let options = this.tabuadasSelecionadas.length > 0 ? this.tabuadasSelecionadas : this.tabuadas

      this.number1 = options[this.getRandomBetween(1, options.length) - 1]
      this.number2 = this.getRandomBetween(1, 10)
    }

    this.rounds++
    this.startedAt = new Date()
    this.resposta = ''
    this.answerType = ''
    this.setFocus()
    let lastNumbers = {
      number1: this.number1,
      number2: this.number2
    }

    localStorage.setItem('lastNumbers-' + this.materia.name, JSON.stringify(lastNumbers))
  }

  toggleTabuada(tabuada: number) {
    const index = this.tabuadasSelecionadas.indexOf(tabuada)
    if (index === -1) {
      this.tabuadasSelecionadas.push(tabuada)
    } else {
      this.tabuadasSelecionadas.splice(index, 1)
    }
    localStorage.setItem('tabuadasSelecionadas', JSON.stringify(this.tabuadasSelecionadas))
  }

  getRandomBetween(lower: number, greater: number) {
    return Math.floor(Math.random() * (greater - lower)) + lower
  }

  getDivisibleBy(divisor: number, lower: number, greater: number) {
    let number = this.getRandomBetween(lower, greater)
    while (number % divisor !== 0) {
      number++
    }
    return number
  }

  async playAnimation() {
    const interval = setInterval(() => {
      confetti('tsparticles', {});
    }, 400)

    setTimeout(() => {
      clearInterval(interval)
    }, 850);

  }

  public ngOnDestroy(): void {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.container?.destroy();
  }

  public setFocus() {
    setTimeout(() => {
      const element: HTMLInputElement | null = this.elementRef.nativeElement.querySelector('#input')
      element?.focus();
    }, 100);
  }

  public handleKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT') return
    if (event.key === 'Enter' && this.answerType !== '') {
      this.restart();
    }
  }

  public ngOnInit(): void {
    this.materia = this.materias.find(materia => materia.name === this.operacao)
    const stored = localStorage.getItem('scoreboard-' + this.materia.name)
    stored && (this.scoreboard = JSON.parse(stored))
    const storedTabuadas = localStorage.getItem('tabuadasSelecionadas')
    this.tabuadasSelecionadas = storedTabuadas ? JSON.parse(storedTabuadas) : [...this.tabuadas]

    this.showScoreboard = localStorage.getItem('showScoreboard') === 'true'

    this.restart()
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }


  convertTimeInMSToHumanReadableSimple(timeInMS: number): string {
    const hours = Math.floor(timeInMS / 3600000);
    const seconds = Math.floor(timeInMS / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const milliseconds = timeInMS % 1000;
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    if (hours > 0) {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else if (minutes > 0) {
      return `${formattedMinutes}:${formattedSeconds}`;
    } else if (seconds > 1) {
      return `${remainingSeconds}s`;
    }
    return remainingSeconds > 0 ? `${remainingSeconds}s ${milliseconds}ms` : `${milliseconds}ms`;
  }

}
