import { window, workspace, WorkspaceFolder } from 'vscode'
import { WorkspaceConfigurationToLaunch } from './types'

export function getWorkspaceConfigurationsToLaunch(
  workspaceFolder: WorkspaceFolder
): WorkspaceConfigurationToLaunch[] {
  const configurationsToLaunch: WorkspaceConfigurationToLaunch[] = []
  const configurations = workspace
    .getConfiguration('launch', workspaceFolder.uri)
    .get('configurations')
  if (Array.isArray(configurations)) {
    configurations.forEach((configuration) => {
      if (configuration.auto === true) {
        const name = configuration.name
        if (name) {
          configurationsToLaunch.push({ name, workspaceFolder })
        } else {
          window.showErrorMessage('launch.json: the property "name" must be defined.')
        }
      }
    })
  }
  return configurationsToLaunch
}
