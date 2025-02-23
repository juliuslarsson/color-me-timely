import * as vscode from 'vscode';

export default async (context: vscode.ExtensionContext) => {
  const color = await vscode.window.showInputBox({
    placeHolder: 'Enter a color (e.g., #ff0000 for red)',
    validateInput: (input) => /^#[0-9A-Fa-f]{6}$/.test(input) ? null : 'Please enter a valid hex color code'
  });

  if (color) {
    context.workspaceState.update('headerColor', color);
    vscode.window.showInformationMessage(`Color ${color} chosen!`);
  } else {
    vscode.window.showWarningMessage('No color entered. Color not chosen.');
  }
}