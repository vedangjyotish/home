import { DecimalPipe } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { RouterLink } from "@angular/router";
// import { Component, computed, signal } from '@angular/core';
// import { cdata } from '../cdata';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})

export class CardComponent {
  @Input({required: true }) cid!: string;
  @Input({required: true}) name!: string;
  @Input() alt!: string;
  @Input({required: true}) img!: string;
  @Input({required: true}) rating!: number;
  @Input({required: true}) highlights!: any[];
  @Input({required: true}) taglines!: any[];
  @Input({required: true}) price!: string;
  @Output() select = new EventEmitter();

  get imagePath() {
    return 'assets/ccards/img/' + this.img;
  }

  // --------- A helper class
  onSelectCard () {
    this.select.emit(this.cid);
  }

  // -------- signal based code
  // name = input.required<string>();
  // alt = input.required<string>();
  // img = input.required<string>();
  //
  // imagePath = computed(() => 'assets/ccards/img/' + this.img());
  // -------- signal based code


}

// export class CardComponent {
//   count = 0;
//   c_card = signal(cdata[this.count]);
//
//   imagePath = computed(() => 'assets/ccards/img/' + this.c_card().img);
//
//   onSelectCard() {
//     this.count = this.count + 1;
//     if (this.count === 3) { this.count = 0 };
//     this.c_card.set(cdata[this.count]);
//   }
//  }
