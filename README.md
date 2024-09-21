# Function to Files - VSCode Extension

![Logo](./functions-to-files.png)

## Overview

The **Function to Files** extension provides a seamless way to split out TypeScript utility functions from a file into individual named files. With this tool, developers can easily maintain and organize their TypeScript projects by separating large files containing multiple utility functions into smaller, more manageable files.

---

## Features

- **Extract Functions to Individual Files**: Automatically separates utility functions from one large file into smaller, named files.
- **File Organization**: Places each extracted function in a new file with a corresponding name, reducing the clutter in your main code files.
- **Customizable Path and Naming**: The extension allows you to specify the directory where extracted files will be placed, as well as the naming convention used for the files.
- **TSConfig Integration**: Ensures that all newly created files are included in the appropriate `tsconfig.json` or any custom module resolution strategies.

---

## Installation

To install the extension, follow these steps:

1. Open Visual Studio Code.
2. Go to the **Extensions** view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for `Function to Files` in the search bar.
4. Click **Install** to add it to your VSCode setup.

---

## How to Use

### 1. Select Function(s)

- Highlight or select the TypeScript utility function(s) you wish to extract.
  
### 2. Use Command Palette

- Open the **Command Palette** (`Cmd` + `Shift` + `P` on macOS, `Ctrl` + `Shift` + `P` on Windows/Linux).
- Type `Function to Files: Extract Functions` and press `Enter`.

### 3. File Creation

- The extension will automatically generate a new TypeScript file for each selected function in the same directory or a customizable location.

---

## Customization

### 1. File Path Customization

You can specify where the extracted files will be placed. The default behavior is to generate the new files in the same directory as the source file, but you can modify this behavior by changing the `functionToFiles.defaultOutputDir` setting.

```json
{
  "functionToFiles.defaultOutputDir": "src/utils"
}
```

### 2. Naming Convention

By default, the new files will be named based on the function name. You can customize this pattern in the settings:

```json
{
  "functionToFiles.fileNamingConvention": "snake_case" // options: 'camelCase', 'PascalCase', 'snake_case'
}
```

---

## Requirements

- Visual Studio Code v1.90.0 or higher
- Node.js v20.17.0 or higher
- TypeScript v5.0 or higher

---

## Known Issues

- Functions without proper names may not extract correctly.
- Nested functions within other functions are not supported at this time.

If you encounter any issues, please [report them here](https://github.com/dankreiger/functions-to-files/issues).

---

## Contributing

Contributions are welcome! Please submit a pull request or open an issue on the [GitHub repository](https://github.com/dankreiger/functions-to-files).

---

## License

This extension is licensed under the [MIT License](LICENSE).

---

## Support

For support, open an issue on the GitHub repository.

