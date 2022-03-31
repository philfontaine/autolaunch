import { window } from 'vscode'

const outputChannel = window.createOutputChannel('AutoLaunch')

export function logErrorTaskMissingLabel(task: any) {
  outputChannel.appendLine(
    '[ERROR] tasks.json: the "label" property is missing for the following task:'
  )
  outputChannel.appendLine(JSON.stringify(task, null, 2))
  outputChannel.appendLine('')
  outputChannel.show(true)
}

export function logErrorUserTaskMissingLabel(task: any) {
  outputChannel.appendLine(
    '[ERROR] User (global) tasks.json: the "label" property is missing for the following task:'
  )
  outputChannel.appendLine(JSON.stringify(task, null, 2))
  outputChannel.appendLine('')
  outputChannel.show(true)
}

export function logErrorLaunchConfigMissingName(configuration: any) {
  outputChannel.appendLine(
    '[ERROR] launch.json: the "name" property is missing for the following configuration:'
  )
  outputChannel.appendLine(JSON.stringify(configuration, null, 2))
  outputChannel.appendLine('')
  outputChannel.show(true)
}

export function logErrorUnknownMode(mode: string) {
  outputChannel.appendLine(`[ERROR] Unknown value "${mode}" for property autolaunch.mode`)
  outputChannel.show(true)
}
