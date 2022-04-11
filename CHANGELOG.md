# Changelog

### 2.1.2 (April 10, 2022)

- Fixed a bug related to user tasks, where the extension tried to run the task twice.
- Prompt mode: Changed the Yes/No button order so that the Yes button is the primary color.
- Errors will now be displayed in a dedicated output instead of in notifications.

### 2.1.1 (March 28, 2022)

- Fixed: user level tasks were failing silently if the file had comments (now parsing with JSON5)

### 2.1.0 (March 28, 2022)

- Added support for [user level tasks](https://code.visualstudio.com/docs/editor/tasks#_user-level-tasks)
- Improved the prompt message (now showing the tasks/configurations name instead of the task/configuration count)

### 2.0.9 (June 6, 2021)

- Forgot to update Changelog before publishing 2.0.8

### 2.0.8 (June 6, 2021)

- Updated project and dependencies
- Optimized activation events (so that AutoLaunch does not slow down startup when opening folders that don't have tasks.json or launch.json)

### 2.0.7 (June 6, 2021)

- Revert 2.0.4-2.0.6

### 2.0.4 - 2.0.6 (June 5-6, 2021)

- Broken extension due to bad update.

### 2.0.3 (November 30, 2019)

- Updated readme, dependencies, changelog
- Bugfix: Fix a bug when no folder was opened at startup

### 2.0.2 (July 28, 2018)

- Hotfix: Fixed the prompt message

### 2.0.1 (July 28, 2018)

- Hotfix: Changed to a valid tsconfig target

### 2.0.0 (July 28, 2018)

- Updated to the new vscode Task API that landed in 1.24. Closes [#5](https://github.com/philfontaine/autolaunch/issues/5) and Fixes [#4](https://github.com/philfontaine/autolaunch/issues/4)
- Allow user to be prompted before AutoLaunching. Closes [#6](https://github.com/philfontaine/autolaunch/issues/6)
- Completely removed support for versions prior to 1.0.0

### 1.2.0 (March 29, 2018)

- Added logo.

### 1.1.0 (February 27, 2018)

- Workspace support. Will now parse every folder added to the workspace.

### 1.0.0 (February 27, 2018)

- Breaking change: autolaunch.config is deprecated. Now simply add `"auto": true` to automatically run/launch the task/configuration.
- Added schema validation for the `auto` property

### 0.0.3 (November 2, 2017)

- Updated package.json
- Added Github section to readme

### 0.0.2 (November 2, 2017)

- Added License
- Updated package.json

### 0.0.1 (November 2, 2017)

- Initial release
