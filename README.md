# AutoLaunch

AutoLaunch will automatically run a task defined in `tasks.json` or launch a configuration defined in `launch.json` when VS Code starts up.

> **Note**
>
> For tasks, this feature is now [built-in](https://code.visualstudio.com/docs/editor/tasks#_run-behavior) into VS Code, so you might want to use that instead.

Simply add `"auto": true` in the task or configuration you want to AutoLaunch.

`tasks.json` example:

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

`launch.json` example:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceRoot}/main.js",
      "auto": true
    }
  ]
}
```

## Requirements

[Tasks](https://code.visualstudio.com/docs/editor/tasks) must be defined in `tasks.json` and have the `label` properties defined. [User level tasks](https://code.visualstudio.com/docs/editor/tasks#_user-level-tasks) are also supported.

[Launch Configurations](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations) must be defined in `launch.json` and have the `name` property defined.

## Modes

The behaviour of AutoLaunch can be changed globally by changing the mode in the settings (`autolaunch.mode`) to one of the following:

- `auto`: Will AutoLaunch directly as expected (default mode).
- `prompt`: Will prompt the user to AutoLaunch or not. This is useful in the case where you want to open a folder to simply look at it.
- `disabled`: Same as disabling the extension.

## Known Issues

- VS Code will warn that "Property auto is not allowed" on tasks.

## Links

- [Marketplace](https://marketplace.visualstudio.com/items?itemName=philfontaine.autolaunch)
- [Repository](https://github.com/philfontaine/autolaunch)
- [Change Log](https://github.com/philfontaine/autolaunch/blob/master/CHANGELOG.md)
- [Issues](https://github.com/philfontaine/autolaunch/issues)

---
