'use strict'
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  if (legacyAutoLaunch()) return

  const promptUser = (names:string[]):Promise<void> => {
    const promptBeforeLaunch: boolean = vscode.workspace.getConfiguration('autolaunch').get('promptBeforeLaunch')
    if(promptBeforeLaunch !== true) {
      return Promise.resolve()
    } else {
      return new Promise((resolve, reject) => {
        const continueAutoLaunchingString: string = `Launch the tasks ${names.length ? `(${names.join(', ')})` : ''}`
        vscode.window.showQuickPick([continueAutoLaunchingString, 'Don\'t launch the tasks']).then(selection => {
          if (selection === continueAutoLaunchingString) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }
  }


  vscode.workspace.workspaceFolders.forEach(workspaceFolder => {
    const tasks:string[] = getTasks(workspaceFolder)
    const configurations:{workspaceFolder:vscode.WorkspaceFolder, name:string}[] = getConfigurations(workspaceFolder)
    if(!tasks.length && !configurations.length) {
      return
    }
    promptUser(tasks.concat(configurations.map(c => c.name)).filter(name => name !== undefined && name !== null)).then(():void => {
      tasks.forEach((name:string):void => {
        if (name) {
          vscode.commands.executeCommand('workbench.action.tasks.runTask', name)
        } else {
          vscode.window.showErrorMessage('tasks.json: the property "label" must be defined.')
        }
      })

      configurations.forEach(({workspaceFolder, name}):void => {
        if (name) {
          vscode.debug.startDebugging(workspaceFolder, name)
        } else {
          vscode.window.showErrorMessage('launch.json: the property "name" must be defined.')
        }
      })
    })
  })
}

function getTasks(workspaceFolder: vscode.WorkspaceFolder): string[] {
  const result:string[] = []
  const tasks = vscode.workspace.getConfiguration('tasks', workspaceFolder.uri).get('tasks')
  if (Array.isArray(tasks)) {
    tasks.forEach(task => {
      if (task.auto === true) {
        const name = task.label || task.taskName
        result.push(name || undefined)
      }
    })
  }
  return result
}

function getConfigurations(workspaceFolder: vscode.WorkspaceFolder): {workspaceFolder:vscode.WorkspaceFolder, name:string}[] {
  const result:{workspaceFolder:vscode.WorkspaceFolder, name:string}[] = []
  const configurations = vscode.workspace
    .getConfiguration('launch', workspaceFolder.uri)
    .get('configurations')
  if (Array.isArray(configurations)) {
    configurations.forEach(configuration => {
      if (configuration.auto === true) {
        result.push({workspaceFolder, name: configuration.name})
      }
    })
  }
  return result
}

/* LEGACY CODE, WILL BE REMOVED IN FUTURE RELEASES */
interface AutoLaunch {
  type: string
  name: string
}

const showErrorMessage = (message: string): void => {
  vscode.window.showErrorMessage(message)
}

const showWarningMessage = (message: string): void => {
  vscode.window.showWarningMessage(message)
}

function legacyAutoLaunch() {
  let usingLegacy: boolean
  const autolaunchArray: ReadonlyArray<AutoLaunch> = vscode.workspace
    .getConfiguration('autolaunch')
    .get('config')
  if (autolaunchArray) {
    usingLegacy = true
    showWarningMessage(
      "autolaunch.config configuration is DEPRECATED. See the extension's README for more details."
    )
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
    usingLegacy = false
  }
  return usingLegacy
}
