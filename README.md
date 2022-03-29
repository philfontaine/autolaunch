# AutoLaunch

AutoLaunch will automatically run a task in "tasks.json" or launch a configuration in "launch.json" when VS Code starts up.

Simply add `"auto": true` in the task or configuration you want to AutoLaunch!

> For tasks, this feature is now [built-in](https://code.visualstudio.com/docs/editor/tasks#_run-behavior) into VS Code (since 1.30), so you might want to check that out instead.

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

[`tasks.json` syntax reference](https://code.visualstudio.com/docs/editor/tasks)

> Since 2.1.0, [user level tasks](https://code.visualstudio.com/docs/editor/tasks#_user-level-tasks) can also be autolaunched.

### Configurations

Configurations must be defined in `launch.json`. They must have the `name` property defined.

[`launch.json` syntax reference](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)

## Modes

v2.0.0 introduces modes that can change the behaviour of AutoLaunch. The possible modes are:
- `auto`: Will AutoLaunch directly as expected (default mode).
- `prompt`: Will prompt the user to AutoLaunch or not. This is useful in the case where you want to open a folder to simply look at it.
- `disabled`: Same as disabling the extension.

The mode can be changed in the settings: `autolaunch.mode`

## Limitations

* Configurations are launched in debug mode (same as 'Start Debugging' or F5)

## Known Issues

* VS Code will warn that "Property auto is not allowed" on tasks.

## Links

* [Marketplace](https://marketplace.visualstudio.com/items?itemName=philfontaine.autolaunch)
* [Repository](https://github.com/philfontaine/autolaunch)
* [Change Log](https://github.com/philfontaine/autolaunch/blob/master/CHANGELOG.md)
* [Issues](https://github.com/philfontaine/autolaunch/issues)

---
