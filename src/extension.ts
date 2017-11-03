'use strict'
import * as vscode from 'vscode'

interface AutoLaunch {
  type: string
  name: string
}

const showErrorMessage = (message: string): void => {
  vscode.window.showErrorMessage(`Error in AutoLaunch extension: ${message}`)
}

export function activate(context: vscode.ExtensionContext) {
  const autolaunchArray: ReadonlyArray<AutoLaunch> = vscode.workspace
    .getConfiguration('autolaunch')
    .get('config')
  if (autolaunchArray) {
    if (Array.isArray(autolaunchArray)) {
      autolaunchArray.forEach(autolaunch => {
        const { name, type } = autolaunch
        if (name) {
          switch (type) {
            case 'task':
              vscode.commands.executeCommand('workbench.action.tasks.runTask', name)
              break
            case 'launch':
              vscode.debug
                .startDebugging(vscode.workspace.workspaceFolders[0], name)
                .then(null, reason => {
                  showErrorMessage(reason)
                })
              break
            default:
              if (type) {
                showErrorMessage(
                  `Unknown value for property "type": "${type}". Supported values are "task" and "launch".`
                )
              } else {
                showErrorMessage('Property "type" must be defined')
              }
              break
          }
        } else {
          showErrorMessage('Property "name" must be defined')
        }
      })
    } else {
      showErrorMessage(
        'Property "autolaunch.config" must be an Array of {"type": "task" || "launch", "name": string }'
      )
    }
  }
}
