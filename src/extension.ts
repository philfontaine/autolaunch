'use strict'
import * as vscode from 'vscode'

const run = 'Run'
const launch = 'Launch'
const cancel = 'Cancel'

export function activate(context: vscode.ExtensionContext) {
  runTasks()
  launchConfigurations()
}

async function runTasks() {
  vscode.tasks.fetchTasks().then(tasks => {
    vscode.workspace.workspaceFolders.forEach(workspaceFolder => {
      const taskDefinitions = vscode.workspace
        .getConfiguration('tasks', workspaceFolder.uri)
        .get('tasks')
      if (Array.isArray(taskDefinitions)) {
        taskDefinitions.forEach(taskDefinition => {
          if (taskDefinition.auto) {
            const name = taskDefinition.label || taskDefinition.taskName
            if (name) {
              if (taskDefinition.auto === 'prompt') {
                vscode.window
                  .showInformationMessage(`Run task "${name}"?`, cancel, run)
                  .then(result => {
                    if (result === run) {
                      findAndRunTask(tasks, name, workspaceFolder.name)
                    }
                  })
              } else {
                findAndRunTask(tasks, name, workspaceFolder.name)
              }
            } else {
              vscode.window.showErrorMessage('tasks.json: the property "label" must be defined.')
            }
          }
        })
      }
    })
  })
}

/* any[] is to prevent an error with typescript which I don't understand */
function findAndRunTask(tasks: any[], taskName: string, workspaceFolderName: string) {
  const task = tasks.find(
    task => task.name === taskName && task.scope && task.scope.name === workspaceFolderName
  )
  if (task) {
    vscode.tasks.executeTask(task)
  } else {
    vscode.window.showErrorMessage(
      `An error occured while trying to AutoLaunch the task '${taskName}'. Please make sure the task is properly configured.`
    )
  }
}

function launchConfigurations() {
  vscode.workspace.workspaceFolders.forEach(workspaceFolder => {
    const configurations = vscode.workspace
      .getConfiguration('launch', workspaceFolder.uri)
      .get('configurations')
    if (Array.isArray(configurations)) {
      configurations.forEach(configuration => {
        if (configuration.auto) {
          const name = configuration.name
          if (name) {
            if (configuration.auto === 'prompt') {
              vscode.window
                .showInformationMessage(`Launch configuration '${name}'?`, cancel, launch)
                .then(result => {
                  if (result === launch) {
                    vscode.debug.startDebugging(workspaceFolder, name)
                  }
                })
            } else {
              vscode.debug.startDebugging(workspaceFolder, name)
            }
          } else {
            vscode.window.showErrorMessage('launch.json: the property "name" must be defined.')
          }
        }
      })
    }
  })
}
