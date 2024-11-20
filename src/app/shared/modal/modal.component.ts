import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-button" (click)="close()">×</button>
        </div>
        <div class="modal-content">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" (click)="close()">OK</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      font-size: 10px; /* Base font size: 1rem = 10px */
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-container {
      background-color: white;
      border-radius: 0.8rem;
      padding: 2.4rem;
      width: 90%;
      max-width: 40rem;
      box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .modal-header h3 {
      margin: 0;
      color: #333;
      font-size: 2rem;
      font-weight: 600;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 2.8rem;
      cursor: pointer;
      color: #666;
      padding: 0;
      line-height: 1;
      width: 2.8rem;
      height: 2.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-button:hover {
      color: #333;
    }

    .modal-content {
      margin-bottom: 2rem;
    }

    .modal-content p {
      margin: 0;
      color: #666;
      font-size: 1.6rem;
      line-height: 1.5;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 0.4rem;
      cursor: pointer;
      font-size: 1.4rem;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    /* Media query for smaller screens */
    @media (max-width: 480px) {
      .modal-container {
        padding: 2rem;
        width: 95%;
      }

      .modal-header h3 {
        font-size: 1.8rem;
      }

      .modal-content p {
        font-size: 1.4rem;
      }

      .btn-primary {
        font-size: 1.3rem;
        padding: 0.8rem 1.6rem;
      }
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
