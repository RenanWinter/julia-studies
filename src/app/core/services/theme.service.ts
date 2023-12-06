import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  setTheme(theme: string) {
    const dom = document.getElementsByTagName('html')
    const html = dom[0]
    html.setAttribute('data-theme', theme)
    localStorage.setItem('app-theme', theme)
  }

  loadTheme() {
    const stored = localStorage.getItem('app-theme')
    if (stored) {
      this.setTheme(stored)
    }
  }
}
