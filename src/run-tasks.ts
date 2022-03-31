import { tasks } from 'vscode'
import { TaskToRun } from './types'

export function runTasks(tasksToRun: TaskToRun[]) {
  tasksToRun.forEach((taskToRun) => {
    tasks.executeTask(taskToRun.task)
  })
}
