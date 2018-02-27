# AutoLaunch

AutoLaunch will automatically run a task in "tasks.json" or launch a configuration in "launch.json" when VS Code starts up. 

Simply add `"auto": true` in the task or configuration you want to AutoLaunch!

tasks.json example:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "npm start",
      "type": "npm",
      "script": "start",
      "auto": true
    }
  ]
}
```

launch.json example:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceRoot}/Program.js",
      "auto": true
    }
  ]
}
```

## Requirements
### Tasks
Tasks must be defined in `tasks.json`. They must have the `label` or `taskName` properties defined. `taskName` is deprecated by VS Code but still supported by the extension.

[`tasks.json` syntax Reference](https://code.visualstudio.com/docs/editor/tasks)

### Configurations
Configurations must be defined in `launch.json`. They must have the `name` property defined.

[`launch.json` syntax Reference](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)

## Limitations
- Configurations are launched in debug mode (same as 'Start Debugging' or F5)

## Known Issues
- VS Code will warn that "Property auto is not allowed". Waiting for this [issue](https://github.com/Microsoft/vscode/issues/20193).

## Links
- [Marketplace](https://marketplace.visualstudio.com/items?itemName=philfontaine.autolaunch)
- [Repository](https://github.com/philfontaine/autolaunch)
- [Change Log](https://github.com/philfontaine/autolaunch/blob/master/CHANGELOG.md)
- [Issues](https://github.com/philfontaine/autolaunch/issues)

---
