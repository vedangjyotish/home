import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminStateService } from '../../services/admin-state.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <header class="settings-header">
        <h2>Admin Settings</h2>
      </header>

      <div class="settings-grid">
        <div class="settings-card">
          <h3>Notification Settings</h3>
          <div class="setting-item">
            <label class="switch">
              <input type="checkbox" [checked]="settings().emailNotifications" 
                     (change)="updateSetting('emailNotifications', $event)">
              <span class="slider"></span>
            </label>
            <span>Email Notifications</span>
          </div>
          <div class="setting-item">
            <label class="switch">
              <input type="checkbox" [checked]="settings().pushNotifications"
                     (change)="updateSetting('pushNotifications', $event)">
              <span class="slider"></span>
            </label>
            <span>Push Notifications</span>
          </div>
        </div>

        <div class="settings-card">
          <h3>Display Settings</h3>
          <div class="setting-item">
            <label class="switch">
              <input type="checkbox" [checked]="settings().darkMode"
                     (change)="updateSetting('darkMode', $event)">
              <span class="slider"></span>
            </label>
            <span>Dark Mode</span>
          </div>
          <div class="setting-item">
            <label class="switch">
              <input type="checkbox" [checked]="settings().compactView"
                     (change)="updateSetting('compactView', $event)">
              <span class="slider"></span>
            </label>
            <span>Compact View</span>
          </div>
        </div>

        <div class="settings-card">
          <h3>Security Settings</h3>
          <div class="setting-item">
            <label class="switch">
              <input type="checkbox" [checked]="settings().twoFactorAuth"
                     (change)="updateSetting('twoFactorAuth', $event)">
              <span class="slider"></span>
            </label>
            <span>Two-Factor Authentication</span>
          </div>
          <div class="setting-item">
            <label class="switch">
              <input type="checkbox" [checked]="settings().sessionTimeout"
                     (change)="updateSetting('sessionTimeout', $event)">
              <span class="slider"></span>
            </label>
            <span>Session Timeout</span>
          </div>
        </div>
      </div>

      <div class="settings-actions">
        <button class="btn-primary" (click)="saveSettings()">Save Changes</button>
        <button class="btn-secondary" (click)="resetSettings()">Reset to Default</button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 2rem;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .settings-header {
      margin-bottom: 2.4rem;
    }

    .settings-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 2.2rem;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2.4rem;
    }

    .settings-card {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      border: 1px solid #ecf0f1;
    }

    .settings-card h3 {
      color: #2c3e50;
      margin: 0 0 1.6rem 0;
      font-size: 1.8rem;
    }

    .setting-item {
      display: flex;
      align-items: center;
      margin-bottom: 1.6rem;
      font-size: 1.4rem;
    }

    .setting-item span {
      margin-left: 1.6rem;
      color: #2c3e50;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 5rem;
      height: 2.4rem;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 1.6rem;
      width: 1.6rem;
      left: 0.4rem;
      bottom: 0.4rem;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #3498db;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .settings-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-primary, .btn-secondary {
      padding: 1rem 1.6rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
      font-size: 1.4rem;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #7f8c8d;
    }
  `]
})
export class SettingsComponent {
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
    this.settings.update(current => ({
      ...current,
      [setting]: event.target.checked
    }));
  }

  saveSettings() {
    // Implement save settings logic
    this.adminState.addNotification({
      type: 'success',
      message: 'Settings saved successfully'
    });
  }

  resetSettings() {
    this.settings.set({
      emailNotifications: true,
      pushNotifications: false,
      darkMode: false,
      compactView: false,
      twoFactorAuth: false,
      sessionTimeout: true
    });
    this.adminState.addNotification({
      type: 'info',
      message: 'Settings reset to default'
    });
  }
}
