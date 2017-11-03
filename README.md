# Autolaunch

Autolaunch will automatically run a task found in "tasks.json" or launch a debug configuration found in "launch.json" when VS Code starts up.

## Features
- Target specific tasks or launches based on their name
- Runs on VS Code start-up
- Add as many tasks/launches as needed
- Easily per project configurable

## Requirements
### Tasks
Tasks must be defined in `tasks.json`. They **MUST** have the `taskName` or `label` properties defined, depending on the task `type` property.

[`tasks.json` syntax Reference](https://code.visualstudio.com/docs/editor/tasks)


### Launches
Launches must be defined in `launch.json`. They must have the `name` property defined.

[`launch.json` syntax Reference](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)

### Settings
`autolaunch.config`: Array of `{"type": "task" || "launch", "name": string}`

`autolaunch.config` must be defined for this extension to work. It should be defined in the workspace settings, located in `.vscode/settings.json`. It can also be defined in User Settings, but keep in mind that this extension will run for every project.

Example: 
```json
settings.json

{
  "autolaunch.config": [
    {
      "type": "task",
      "name": "My Task"
    },
    {
      "type": "launch",
      "name": "My Launch Configuration"
    }
  ]
}
```

## Limitations
- Launches are launched in debug mode (same as 'Start Debugging' or F5)


---
