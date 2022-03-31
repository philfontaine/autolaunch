import { window } from 'vscode'

export function showErrorUserTaskMissingLabel() {
  window.showErrorMessage(
    '[AutoLaunch] User (global) tasks.json: the "label" property is required when using "auto": true'
  )
}

export function showErrorUnknownMode(mode: string) {
  window.showErrorMessage(`[AutoLaunch] Unknown value "${mode}" for property autolaunch.mode`)
}
