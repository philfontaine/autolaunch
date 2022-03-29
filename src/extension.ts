'use strict'
import * as vscode from 'vscode'
import * as path from 'path'
import { getUserTasksToRun, getWorkspaceTasksToRun } from './tasks-to-run'
import { getWorkspaceConfigurationsToLaunch } from './configurations-to-launch'
import { runUserTasks, runWorkspaceTasks } from './run-tasks'
import { launchConfigurations } from './launch-configurations'

const yes = 'Yes'
const no = 'No'

export function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders) return

  const globalPath = path.dirname(path.dirname(context.globalStorageUri.fsPath))

  const availableTasksPromise = vscode.tasks.fetchTasks()
  vscode.workspace.workspaceFolders.forEach((workspaceFolder) => {
    autolaunchWorkspaceTasksAndConfigurations(workspaceFolder, availableTasksPromise)
  })
  autolaunchUserTaks(globalPath, availableTasksPromise)
}

function autolaunchWorkspaceTasksAndConfigurations(
  workspaceFolder: vscode.WorkspaceFolder,
  availableTasksPromise: Thenable<vscode.Task[]>
) {
  const mode: string = vscode.workspace
    .getConfiguration('autolaunch', workspaceFolder.uri)
    .get('mode')
  if (mode === 'auto' || mode === 'prompt') {
    const tasksToRun = getWorkspaceTasksToRun(workspaceFolder)
    const configurationsToLaunch = getWorkspaceConfigurationsToLaunch(workspaceFolder)

    if (tasksToRun.length || configurationsToLaunch.length) {
      if (mode === 'auto') {
        runWorkspaceTasks(tasksToRun, availableTasksPromise)
        launchConfigurations(configurationsToLaunch)
      } else {
        let promptMessage: string
        if (tasksToRun.length && configurationsToLaunch.length) {
          promptMessage = `Run tasks [${tasksToRun
            .map((t) => t.name)
            .join(', ')}] and launch configurations [${configurationsToLaunch
            .map((c) => c.name)
            .join(', ')}]`
        } else if (tasksToRun.length) {
          promptMessage = `Run tasks [${tasksToRun.map((t) => t.name).join(', ')}]`
        } else {
          promptMessage = `Launch configurations [${configurationsToLaunch
            .map((c) => c.name)
            .join(', ')}]`
        }
        promptMessage += ` in the workspace folder "${workspaceFolder.name}"?`
        vscode.window.showInformationMessage(promptMessage, no, yes).then((result) => {
          if (result === yes) {
            runWorkspaceTasks(tasksToRun, availableTasksPromise)
            launchConfigurations(configurationsToLaunch)
          }
        })
      }
    }
  } else if (mode !== 'disabled') {
    vscode.window.showErrorMessage(`Unknown value "${mode}" for property autolaunch.mode`)
  }
}

async function autolaunchUserTaks(
  globalPath: string,
  availableTasksPromise: Thenable<vscode.Task[]>
) {
  const mode: string = vscode.workspace.getConfiguration('autolaunch').get('mode')
  if (mode === 'auto' || mode === 'prompt') {
    const tasksToRun = await getUserTasksToRun(globalPath)

    if (tasksToRun.length) {
      if (mode === 'auto') {
        runUserTasks(tasksToRun, availableTasksPromise)
      } else {
        const promptMessage = `Run user tasks [${tasksToRun.map((t) => t.name).join(', ')}]?`
        vscode.window.showInformationMessage(promptMessage, no, yes).then((result) => {
          if (result === yes) {
            runUserTasks(tasksToRun, availableTasksPromise)
          }
        })
      }
    }
  } else if (mode !== 'disabled') {
    vscode.window.showErrorMessage(`Unknown value "${mode}" for property autolaunch.mode`)
  }
}
