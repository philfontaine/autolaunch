import { Task, tasks, TaskScope, window, WorkspaceFolder } from 'vscode'
import { UserTaskToRun, WorkspaceTaskToRun } from './types'

export function runWorkspaceTasks(
  tasksToRun: WorkspaceTaskToRun[],
  availableTasksPromise: Thenable<Task[]>
) {
  availableTasksPromise.then((availableTasks) => {
    tasksToRun.forEach((taskToRun) => {
      const task = availableTasks.find(
        (task) =>
          task.name === taskToRun.name &&
          task.scope &&
          typeof task.scope === 'object' &&
          (task.scope as WorkspaceFolder).name === taskToRun.workspaceFolder.name
      )
      if (task) {
        tasks.executeTask(task)
      } else {
        window.showErrorMessage(
          `An error occured while trying to AutoLaunch the task "${taskToRun.name}". Please make sure the task is properly configured.`
        )
      }
    })
  })
}

export function runUserTasks(
  tasksToRun: UserTaskToRun[],
  availableTasksPromise: Thenable<Task[]>
) {
  availableTasksPromise.then((availableTasks) => {
    tasksToRun.forEach((taskToRun) => {
      const task = availableTasks.find(
        (task) => task.name === taskToRun.name && task.scope && task.scope === TaskScope.Workspace
      )
      if (task) {
        tasks.executeTask(task)
      } else {
        window.showErrorMessage(
          `An error occured while trying to AutoLaunch the task "${taskToRun.name}". Please make sure the task is properly configured.`
        )
      }
    })
  })
}
