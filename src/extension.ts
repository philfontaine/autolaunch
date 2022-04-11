import * as path from 'path'
import { ExtensionContext, Task, tasks, window, workspace, WorkspaceFolder } from 'vscode'
import { getWorkspaceConfigurationsToLaunch } from './configurations-to-launch'
import { logErrorUnknownMode } from './logging'
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
  const mode: string = workspace.getConfiguration('autolaunch', workspaceFolder).get('mode')
  if (mode === 'auto' || mode === 'prompt') {
    const tasks = getWorkspaceTasksToRun(workspaceFolder, availableTasks)
    const configurations = getWorkspaceConfigurationsToLaunch(workspaceFolder)

    if (tasks.length > 0 || configurations.length > 0) {
      if (mode === 'auto') {
        runTasks(tasks)
        launchConfigurations(configurations)
      } else {
        let promptMessage: string
        if (tasks.length > 0 && configurations.length > 0) {
          promptMessage = `Run ${pluralize('task', tasks.length)} [${tasks
            .map((t) => t.name)
            .join(', ')}] and launch ${pluralize(
            'configuration',
            configurations.length
          )} [${configurations.map((c) => c.name).join(', ')}]`
        } else if (tasks.length > 0) {
          promptMessage = `Run ${pluralize('task', tasks.length)} [${tasks
            .map((t) => t.name)
            .join(', ')}]`
        } else {
          promptMessage = `Launch ${pluralize(
            'configuration',
            configurations.length
          )} [${configurations.map((c) => c.name).join(', ')}]`
        }
        promptMessage += ` in the workspace folder "${workspaceFolder.name}"?`
        window.showInformationMessage(promptMessage, yes, no).then((result) => {
          if (result === yes) {
            runTasks(tasks)
            launchConfigurations(configurations)
          }
        })
      }
    }
  } else if (mode !== 'disabled') {
    logErrorUnknownMode(mode)
  }
}

async function autolaunchUserTasks(globalPath: string, availableTasks: Task[]) {
  const mode: string = workspace.getConfiguration('autolaunch').get('mode')
  if (mode === 'auto' || mode === 'prompt') {
    const tasks = await getUserTasksToRun(globalPath, availableTasks)

    if (tasks.length > 0) {
      if (mode === 'auto') {
        runTasks(tasks)
      } else {
        const promptMessage = `Run user ${pluralize('task', tasks.length)} [${tasks
          .map((t) => t.name)
          .join(', ')}]?`
        window.showInformationMessage(promptMessage, yes, no).then((result) => {
          if (result === yes) {
            runTasks(tasks)
          }
        })
      }
    }
  } else if (mode !== 'disabled') {
    logErrorUnknownMode(mode)
  }
}

function pluralize(word: string, count: number) {
  return count > 1 ? word + 's' : word
}
