import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminStateService } from '../../services/admin-state.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class AdminSettingsComponent {
  private adminState = inject(AdminStateService);
  settings = signal({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    compactView: false,
    twoFactorAuth: false,
    sessionTimeout: true
  });

  updateSetting(setting: string, event: any) {
    const newSettings = { ...this.settings() };
    newSettings[setting as keyof typeof newSettings] = event.target.checked;
    this.settings.set(newSettings);
  }

  saveSettings() {
    // Implement save logic
    console.log('Saving settings:', this.settings());
  }

  resetSettings() {
    // Implement reset logic
    this.settings.set({
      emailNotifications: true,
      pushNotifications: false,
      darkMode: false,
      compactView: false,
      twoFactorAuth: false,
      sessionTimeout: true
    });
  }
}