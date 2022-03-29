import { debug } from 'vscode'
import { WorkspaceConfigurationToLaunch } from './types'

export function launchConfigurations(configurationsToLaunch: WorkspaceConfigurationToLaunch[]) {
  configurationsToLaunch.forEach((configurationToLaunch) => {
    debug.startDebugging(configurationToLaunch.workspaceFolder, configurationToLaunch.name)
  })
}
