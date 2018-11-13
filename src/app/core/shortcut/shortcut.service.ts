import { Injectable } from '@angular/core';
import { IS_ELECTRON } from '../../app.constants';
import { checkKeyCombo } from '../util/check-key-combo';
import { ConfigService } from '../config/config.service';
import { Router } from '@angular/router';
import { IPC_REGISTER_GLOBAL_SHORTCUT_EVENT } from '../../../ipc-events.const';
import { ElectronService } from 'ngx-electron';
import { LayoutService } from '../layout/layout.service';


@Injectable({
  providedIn: 'root'
})
export class ShortcutService {

  constructor(
    private _configService: ConfigService,
    private _router: Router,
    private _electronService: ElectronService,
    private _layoutService: LayoutService,
  ) {
    //   // Register electron shortcut(s)
    if (IS_ELECTRON && this._configService.cfg.keyboard.globalShowHide) {
      _electronService.ipcRenderer.send(IPC_REGISTER_GLOBAL_SHORTCUT_EVENT, this._configService.cfg.keyboard.globalShowHide);
    }
  }

  handleKeyDown(ev: KeyboardEvent) {
    const cfg = this._configService.cfg;
    const keys = cfg.keyboard;
    const el = ev.target as HTMLElement;

    // don't run when inside input or text area and if no special keys are used
    if ((el && el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.getAttribute('contenteditable'))
      && !ev.ctrlKey && !ev.metaKey) {
      return;
    }
    console.log(checkKeyCombo(ev, keys.toggleBacklog), ev);

    // if (checkKeyCombo(ev, cfg.keyboard.openProjectNotes)) {
    //   Dialogs('NOTES', undefined, true);
    // }
    // if (checkKeyCombo(ev, cfg.keyboard.openDistractionPanel)) {
    //   Dialogs('DISTRACTIONS', undefined, true);
    // }
    // if (checkKeyCombo(ev, cfg.keyboard.showHelp)) {
    //   Dialogs('HELP', {template: 'PAGE'}, true);
    // }
    //
    if (checkKeyCombo(ev, keys.toggleBacklog)) {
      this._router.navigate(['/work-view/50']);
    }
    if (checkKeyCombo(ev, keys.goToWorkView)) {
      this._router.navigate(['/work-view']);
    }
    if (checkKeyCombo(ev, keys.goToDailyAgenda)) {
      this._router.navigate(['/daily-agenda']);
    }
    if (checkKeyCombo(ev, keys.goToSettings)) {
      this._router.navigate(['/settings']);
    }
    if (checkKeyCombo(ev, keys.goToFocusMode)) {
      this._router.navigate(['/focus-view']);
    }
    if (checkKeyCombo(ev, keys.addNewTask)) {
      this._layoutService.toggleAddTaskBar();
      ev.preventDefault();
    }

    // special hidden dev tools combo to use them for production
    if (IS_ELECTRON) {
      if (checkKeyCombo(ev, 'Ctrl+Shift+J')) {
        window.ipcRenderer.send('TOGGLE_DEV_TOOLS');
      }
    }
  }
}
