import * as path from 'path'
import { ExtensionContext, Task, tasks, window, workspace, WorkspaceFolder } from 'vscode'
import { getWorkspaceConfigurationsToLaunch } from './configurations-to-launch'
import { showErrorUnknownMode } from './errors'
import { launchConfigurations } from './launch-configurations'
import { runTasks } from './run-tasks'
import { getUserTasksToRun, getWorkspaceTasksToRun } from './tasks-to-run'

const yes = 'Yes'
const no = 'No'

export async function activate(context: ExtensionContext) {
  if (!workspace.workspaceFolders) return

  const availableTasks = await tasks.fetchTasks()

  workspace.workspaceFolders.forEach((workspaceFolder) => {
    autolaunchWorkspaceTasksAndConfigurations(workspaceFolder, availableTasks)
  })

  const globalPath = path.dirname(path.dirname(context.globalStorageUri.fsPath))
  autolaunchUserTasks(globalPath, availableTasks)
}

function autolaunchWorkspaceTasksAndConfigurations(
  workspaceFolder: WorkspaceFolder,
  availableTasks: Task[]
) {
  const mode: string = workspace.getConfiguration('autolaunch', workspaceFolder.uri).get('mode')
  if (mode === 'auto' || mode === 'prompt') {
    const tasksToRun = getWorkspaceTasksToRun(workspaceFolder, availableTasks)
    const configurationsToLaunch = getWorkspaceConfigurationsToLaunch(workspaceFolder)

    if (tasksToRun.length || configurationsToLaunch.length) {
      if (mode === 'auto') {
        runTasks(tasksToRun)
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
        window.showInformationMessage(promptMessage, yes, no).then((result) => {
          if (result === yes) {
            runTasks(tasksToRun)
            launchConfigurations(configurationsToLaunch)
          }
        })
      }
    }
  } else if (mode !== 'disabled') {
    showErrorUnknownMode(mode)
  }
}

async function autolaunchUserTasks(globalPath: string, availableTasks: Task[]) {
  const mode: string = workspace.getConfiguration('autolaunch').get('mode')
  if (mode === 'auto' || mode === 'prompt') {
    const tasksToRun = await getUserTasksToRun(globalPath, availableTasks)

    if (tasksToRun.length) {
      if (mode === 'auto') {
        runTasks(tasksToRun)
      } else {
        const promptMessage = `Run user tasks [${tasksToRun.map((t) => t.name).join(', ')}]?`
        window.showInformationMessage(promptMessage, yes, no).then((result) => {
          if (result === yes) {
            runTasks(tasksToRun)
          }
        })
      }
    }
  } else if (mode !== 'disabled') {
    showErrorUnknownMode(mode)
  }
}
