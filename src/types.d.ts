import { Task, WorkspaceFolder } from 'vscode'

export interface TaskToRun {
  name: string
  task: Task
}

export interface ConfigurationToLaunch {
  name: string
  workspaceFolder: WorkspaceFolder
}
