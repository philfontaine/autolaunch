'use strict'
import * as vscode from 'vscode'

const showErrorMessage = (message: string): void => {
  vscode.window.showErrorMessage(`AutoLaunch: ${message}`)
}

const showWarningMessage = (message: string): void => {
  vscode.window.showWarningMessage(`AutoLaunch: ${message}`)
}

export function activate(context: vscode.ExtensionContext) {
  if (legacyAutoLaunch()) return
  vscode.workspace.workspaceFolders.forEach(workspaceFolder => {
    runTasks(workspaceFolder)
    launchConfigurations(workspaceFolder)
  });
}

function runTasks(workspaceFolder: vscode.WorkspaceFolder) {
  const tasks = vscode.workspace.getConfiguration("tasks", workspaceFolder.uri).get('tasks')
  if (tasks && Array.isArray(tasks)) {
    tasks.forEach(task => {
      if (task.auto === true) {
        const name = task.label || task.taskName;
        if (name) {
          vscode.commands.executeCommand('workbench.action.tasks.runTask', name)
        } else {
          showErrorMessage('tasks.json: the property "label" must be defined.')
        }
      }
    });
  }
}

function launchConfigurations(workspaceFolder: vscode.WorkspaceFolder) {
  const configurations = vscode.workspace.getConfiguration("launch", workspaceFolder.uri).get('configurations')
  if (configurations && Array.isArray(configurations)) {
    configurations.forEach(configuration => {
      if (configuration.auto === true) {
        const name = configuration.name;
        if (name) {
          vscode.debug
            .startDebugging(workspaceFolder, name)
            .then(null, reason => {
              showErrorMessage(reason)
            })
        } else {
          showErrorMessage('launch.json: the property "name" must be defined.')
        }
      }
    });
  }
}

/* LEGACY CODE, WILL BE REMOVED IN FUTURE RELEASES */
interface AutoLaunch {
  type: string
  name: string
}

function legacyAutoLaunch() {
  let usingLegacy: boolean;
  const autolaunchArray: ReadonlyArray<AutoLaunch> = vscode.workspace
    .getConfiguration('autolaunch')
    .get('config')
  if (autolaunchArray) {
    usingLegacy = true;
    showWarningMessage('autolaunch.config configuration is DEPRECATED. See the extension\'s README for more details.')
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
  } else {
    usingLegacy = false;
  }
  return usingLegacy;
}
