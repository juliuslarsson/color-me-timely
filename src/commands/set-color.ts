import { get } from 'http';
import * as vscode from 'vscode';


const getColorFromInput = async () => {
  const color = await vscode.window.showInputBox({
    placeHolder: 'Enter a target color (e.g., #ff0000 for red)',
    validateInput: (input) => /^#[0-9A-Fa-f]{6}$/.test(input) ? null : 'Please enter a valid hex color code'
  });
  if (!color) {
    vscode.window.showWarningMessage('No color entered. Color not chosen.');
  }
  return color;
}

const setTargetColor = async (context: vscode.ExtensionContext) => {
  const color = await getColorFromInput();

  if (color) {
    context.workspaceState.update('targetColor', color);
    vscode.window.showInformationMessage(`Color ${color} chosen as target!`);
  }
}
const setStartColor = async (context: vscode.ExtensionContext) => {
  const color = await getColorFromInput();

  if (color) {
    context.workspaceState.update('startColor', color);
    vscode.window.showInformationMessage(`Color ${color} chosen as start!`);
  }
}

export { setStartColor, setTargetColor }