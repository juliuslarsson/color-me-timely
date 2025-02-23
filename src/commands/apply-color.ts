import * as vscode from 'vscode';


function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function interpolateColor(color1: string, color2: string, factor: number) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return rgbToHex(r, g, b);
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async (context: vscode.ExtensionContext) => {
  const targetColor = context.workspaceState.get('headerColor', '#ff0000');
  const currentColor = vscode.workspace.getConfiguration().get('workbench.colorCustomizations.titleBar.activeBackground', '#000000');
  console.log(`Applying color ${targetColor} to header.`);

  if (vscode.workspace.workspaceFolders) {
    try {
      const stepsInput = await vscode.window.showInputBox({
        placeHolder: 'Enter number of minutes for timer',
        validateInput: (input) => /^\d+$/.test(input) ? null : 'Please enter a valid number'
      });

      if (!stepsInput) {
        vscode.window.showWarningMessage('No number of steps entered. Color transition not applied.');
        return;
      }

      const steps = parseInt(stepsInput, 10);
      if (isNaN(steps) || steps <= 0) {
        vscode.window.showWarningMessage('Invalid number of steps. Color transition not applied.');
        return;
      }

      for (let i = 0; i <= steps; i++) {
        const factor = i / steps;
        const interpolatedColor = interpolateColor(currentColor, targetColor, factor);
        await vscode.workspace.getConfiguration().update('workbench.colorCustomizations', {
          "titleBar.activeBackground": interpolatedColor,
          "titleBar.inactiveBackground": interpolatedColor
        }, vscode.ConfigurationTarget.Workspace);
        await delay(1000); // 1 second delay for each step
      }
      vscode.window.showInformationMessage(`Header color applied: ${targetColor}`);
    } catch (error) {
      console.error(`Failed to apply header color: ${error}`);
      vscode.window.showErrorMessage(`Failed to apply header color: ${error}`);
    }
  } else {
    vscode.window.showErrorMessage('No workspace is open. Please open a workspace first and try again.');
  }
}