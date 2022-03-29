import * as path from 'path'
import * as fs from 'fs'
import { WorkspaceFolder, workspace, window } from 'vscode'
import { UserTaskToRun, WorkspaceTaskToRun } from './types'

export function getWorkspaceTasksToRun(workspaceFolder: WorkspaceFolder): WorkspaceTaskToRun[] {
  const tasksToRun: WorkspaceTaskToRun[] = []
  const tasks = workspace.getConfiguration('tasks', workspaceFolder.uri).get('tasks')
  if (Array.isArray(tasks)) {
    tasks.forEach((task) => {
      if (task.auto === true) {
        const name = task.label || task.taskName
        if (name) {
          tasksToRun.push({ name, workspaceFolder })
        } else {
          window.showErrorMessage('tasks.json: the property "label" must be defined.')
        }
      }
    })
  }
  return tasksToRun
}

export async function getUserTasksToRun(globalPath: string): Promise<UserTaskToRun[]> {
  const tasksToRun: UserTaskToRun[] = []

  const tasksFile = path.join(globalPath, 'tasks.json')

  const tasks = await new Promise((resolve, reject) => {
    fs.readFile(tasksFile, 'utf8', (err, data) => {
      if (err) {
        resolve(undefined)
      } else {
        resolve(JSON.parse(data)?.tasks)
      }
    })
  })

  if (Array.isArray(tasks)) {
    tasks.forEach((task) => {
      if (task.auto === true) {
        const name: string | undefined = task.label || task.taskName
        if (name) {
          tasksToRun.push({ name })
        } else {
          window.showErrorMessage('tasks.json: the property "label" must be defined.')
        }
      }
    })
  }

  return tasksToRun
}
