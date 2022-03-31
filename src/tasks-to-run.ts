import * as fs from 'fs'
import * as JSON5 from 'json5'
import * as path from 'path'
import { Task, TaskScope, workspace, WorkspaceFolder } from 'vscode'
import { showErrorUserTaskMissingLabel } from './errors'
import { TaskToRun } from './types'

export function getWorkspaceTasksToRun(
  workspaceFolder: WorkspaceFolder,
  availableTasks: Task[]
): TaskToRun[] {
  const tasksToRun: TaskToRun[] = []
  const taskDefinitions = workspace.getConfiguration('tasks', workspaceFolder).get('tasks')
  if (Array.isArray(taskDefinitions)) {
    taskDefinitions.forEach((taskDefinition) => {
      if (taskDefinition.auto === true) {
        const name: string | undefined = taskDefinition.label || taskDefinition.taskName
        if (typeof name !== 'string') {
          // Don't need to warn. The task is not correctly defined so the user is already
          // presented with an error in the Problems panel.
          return
        }
        const task = availableTasks.find(
          (task) =>
            task.name === name &&
            typeof task.scope === 'object' &&
            (task.scope as WorkspaceFolder).name === workspaceFolder.name
        )
        if (task) {
          tasksToRun.push({ name, task })
        }
      }
    })
  }
  return tasksToRun
}

export async function getUserTasksToRun(
  globalPath: string,
  availableTasks: Task[]
): Promise<TaskToRun[]> {
  const tasksToRun: TaskToRun[] = []

  const tasksFile = path.join(globalPath, 'tasks.json')

  const taskDefinitions = await new Promise((resolve) => {
    fs.readFile(tasksFile, 'utf8', (err, data) => {
      if (err) {
        resolve(undefined)
      } else {
        try {
          const json = JSON5.parse(data)
          resolve(json?.tasks)
        } catch (error) {
          resolve(undefined)
        }
      }
    })
  })

  if (Array.isArray(taskDefinitions)) {
    taskDefinitions.forEach((taskDefinition) => {
      if (taskDefinition.auto === true) {
        const name: string | undefined = taskDefinition.label || taskDefinition.taskName
        if (typeof name !== 'string') {
          // Since we are reading the tasks.json file manually, we don't have access to
          // inferred labels (ex: if the type is "npm" and the script is "build", the inferred
          // label is "npm: build"). So, even though the task is correctly defined, we have
          // to show an error message to the user saying that the label property must be
          // explicitly defined. Otherwise, we don't know how to map to the correct task.
          showErrorUserTaskMissingLabel()
          return
        }
        const task = availableTasks.find(
          (task) => task.name === name && task.scope === TaskScope.Workspace
        )
        if (task) {
          tasksToRun.push({ name, task })
        }
      }
    })
  }

  return tasksToRun
}
