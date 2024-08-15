import { Component } from '@angular/core';
import { CardComponent } from './card/card.component';
import { cdata } from './cdata';

@Component({
  selector: 'app-ccards',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './ccards.component.html',
  styleUrl: './ccards.component.css'
})
export class CcardsComponent {
  data = cdata;

  onSelectCard(cid: string) {
    alert("Hey ..." + cid);
  }
}
