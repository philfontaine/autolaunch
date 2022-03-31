import { workspace, WorkspaceFolder } from 'vscode'
import { logErrorLaunchConfigMissingName } from './logging'
import { ConfigurationToLaunch } from './types'

export function getWorkspaceConfigurationsToLaunch(
  workspaceFolder: WorkspaceFolder
): ConfigurationToLaunch[] {
  const configurationsToLaunch: ConfigurationToLaunch[] = []
  const configurations = workspace.getConfiguration('launch', workspaceFolder).get('configurations')
  if (Array.isArray(configurations)) {
    configurations.forEach((configuration) => {
      if (configuration.auto === true) {
        const name: string | undefined = configuration.name
        if (typeof name !== 'string') {
          logErrorLaunchConfigMissingName(configuration)
          return
        }
        configurationsToLaunch.push({ name, workspaceFolder })
      }
    })
  }
  return configurationsToLaunch
}
