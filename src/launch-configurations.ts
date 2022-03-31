import { debug } from 'vscode'
import { ConfigurationToLaunch } from './types'

export function launchConfigurations(configurationsToLaunch: ConfigurationToLaunch[]) {
  configurationsToLaunch.forEach((configurationToLaunch) => {
    debug.startDebugging(configurationToLaunch.workspaceFolder, configurationToLaunch.name)
  })
}
