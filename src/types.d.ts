import { WorkspaceFolder } from 'vscode'

export interface WorkspaceTaskToRun {
  name: string
  workspaceFolder: WorkspaceFolder
}

export interface UserTaskToRun {
  name: string
}

export interface WorkspaceConfigurationToLaunch {
  name: string
  workspaceFolder: WorkspaceFolder
}
