import { Component, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  constructor(private renderer: Renderer2, private el: ElementRef) { }
  //   const signUpButton = document.getElementById('signUp');
  // const signInButton = document.getElementById('signIn');
  // const container = document.getElementById('container');

  signUp(ev: Event) {
    ev.preventDefault();
    const myElement = this.el.nativeElement.querySelector('#container'); 
    this.renderer.addClass(myElement, 'right-panel-active'); 
    // container.classList.add("right-panel-active");
  }

  signIn(ev: Event) {
    ev.preventDefault();
    // container.classList.remove("right-panel-active");
    const myElement = this.el.nativeElement.querySelector('#container'); 
    this.renderer.removeClass(myElement, 'right-panel-active'); 
  }

  // signUpButton.addEventListener('click', () => {
  // });
  //
  // signInButton.addEventListener('click', () => {
  // });

}
