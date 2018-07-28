'use strict'
import * as vscode from 'vscode'

const yes = 'Yes'
const no = 'No'

interface ItemToLaunch {
  name: string
  workspaceFolder: vscode.WorkspaceFolder
}

export function activate(context: vscode.ExtensionContext) {
  const availableTasksPromise = vscode.tasks.fetchTasks()
  vscode.workspace.workspaceFolders.forEach(workspaceFolder => {
    const mode: string = vscode.workspace
      .getConfiguration('autolaunch', workspaceFolder.uri)
      .get('mode')
    if (mode === 'auto' || mode === 'prompt') {
      const tasksToRun = getTasksToRun(workspaceFolder)
      const configurationsToLaunch = getConfigurationsToLaunch(workspaceFolder)

      if (tasksToRun.length || configurationsToLaunch.length) {
        if (mode === 'auto') {
          runTasks(tasksToRun, availableTasksPromise)
          launchConfigurations(configurationsToLaunch)
        } else {
          let promptMessage: string
          if (tasksToRun.length && configurationsToLaunch.length) {
            promptMessage = `Run tasks (${tasksToRun.length}) and launch configurations (${
              configurationsToLaunch.length
            })`
          } else if (tasksToRun.length) {
            promptMessage = `Run tasks (${tasksToRun.length})`
          } else {
            promptMessage = `Launch configurations (${configurationsToLaunch.length})`
          }
          promptMessage += ` in the workspace folder "${workspaceFolder.name}"?`
          vscode.window.showInformationMessage(promptMessage, no, yes).then(result => {
            if (result === yes) {
              runTasks(tasksToRun, availableTasksPromise)
              launchConfigurations(configurationsToLaunch)
            }
          })
        }
      }
    } else if (mode !== 'disabled') {
      vscode.window.showErrorMessage(`Unknown value "${mode}" for property autolaunch.mode`)
    }
  })
}

function getTasksToRun(workspaceFolder: vscode.WorkspaceFolder): ItemToLaunch[] {
  const tasksToRun: ItemToLaunch[] = []
  const tasks = vscode.workspace.getConfiguration('tasks', workspaceFolder.uri).get('tasks')
  if (Array.isArray(tasks)) {
    tasks.forEach(task => {
      if (task.auto === true) {
        const name = task.label || task.taskName
        if (name) {
          tasksToRun.push({ name, workspaceFolder })
        } else {
          vscode.window.showErrorMessage('tasks.json: the property "label" must be defined.')
        }
      }
    })
  }
  return tasksToRun
}

function getConfigurationsToLaunch(workspaceFolder: vscode.WorkspaceFolder): ItemToLaunch[] {
  const configurationsToLaunch: ItemToLaunch[] = []
  const configurations = vscode.workspace
    .getConfiguration('launch', workspaceFolder.uri)
    .get('configurations')
  if (Array.isArray(configurations)) {
    configurations.forEach(configuration => {
      if (configuration.auto === true) {
        const name = configuration.name
        if (name) {
          configurationsToLaunch.push({ name, workspaceFolder })
        } else {
          vscode.window.showErrorMessage('launch.json: the property "name" must be defined.')
        }
      }
    })
  }
  return configurationsToLaunch
}

/* any[] is to prevent an error with typescript which I don't understand */
function runTasks(tasksToRun: ItemToLaunch[], availableTasksPromise: Thenable<any[]>) {
  availableTasksPromise.then(availableTasks => {
    tasksToRun.forEach(taskToRun => {
      const task = availableTasks.find(
        task =>
          task.name === taskToRun.name &&
          task.scope &&
          task.scope.name === taskToRun.workspaceFolder.name
      )
      if (task) {
        vscode.tasks.executeTask(task)
      } else {
        vscode.window.showErrorMessage(
          `An error occured while trying to AutoLaunch the task "${
            taskToRun.name
          }". Please make sure the task is properly configured.`
        )
      }
    })
  })
}

function launchConfigurations(configurationsToLaunch: ItemToLaunch[]) {
  configurationsToLaunch.forEach(configurationToLaunch => {
    vscode.debug.startDebugging(configurationToLaunch.workspaceFolder, configurationToLaunch.name)
  })
}
