import * as vscode from 'vscode';


function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {
    r, g, b
  }
}

function rgbToHex(r: number, g: number, b: number) {
  const red = r.toString(16).length === 1 ? `0${r.toString(16)}` : r.toString(16);
  const green = g.toString(16).length === 1 ? `0${g.toString(16)}` : g.toString(16);
  const blue = b.toString(16).length === 1 ? `0${b.toString(16)}` : b.toString(16);
  return `#${red}${green}${blue}`;
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

const startTimer = async (context: vscode.ExtensionContext, token: vscode.CancellationToken) => {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage('No workspace is open. Please open a workspace first and try again.');
    throw new Error('Unable to start timer')
  }

  const targetColor = context.workspaceState.get('targetColor', '#665012');
  const startColor = context.workspaceState.get('startColor', '#1f1f1f');
  const colorCustomizations = vscode.workspace.getConfiguration('workbench.colorCustomizations');
  const originalColor = colorCustomizations['titleBar.activeBackground'];


  context.workspaceState.update('originalHeaderColor', originalColor);

  try {
    const nrOfMinutesInput = await vscode.window.showInputBox({
      placeHolder: 'Enter number of minutes for timer',
      validateInput: (input) => /^\d+$/.test(input) ? null : 'Please enter a valid number'
    });

    if (!nrOfMinutesInput) {
      vscode.window.showWarningMessage('No number of minutes entered. Color transition not applied.');
      return;
    }

    const minutes = parseInt(nrOfMinutesInput, 10);
    if (isNaN(minutes) || minutes <= 0) {
      vscode.window.showWarningMessage('Invalid number of minutes. Color transition not applied.');
      return;
    }

    const steps = 20;
    const totalDuration = minutes * 60 * 1000;
    const stepDelay = totalDuration / steps;
    vscode.window.showInformationMessage(`Timer started! `);
    for (let i = 0; i <= steps; i++) {
      if (token.isCancellationRequested) {
        vscode.window.showInformationMessage('Color transition aborted.');
        return;
      }
      const factor = i / steps;
      const interpolatedColor = interpolateColor(startColor, targetColor, factor);
      const colorCustomizations = vscode.workspace.getConfiguration('workbench.colorCustomizations');
      const updatedColorCustomizations = {
        ...colorCustomizations,
        "titleBar.activeBackground": interpolatedColor,
        "titleBar.inactiveBackground": interpolatedColor
      };
      await vscode.workspace.getConfiguration().update('workbench.colorCustomizations', updatedColorCustomizations, vscode.ConfigurationTarget.Workspace);
      await delay(stepDelay);
    }

  } catch (error) {
    console.error(`Failed to apply header color: ${error}`);
    vscode.window.showErrorMessage(`Failed to apply header color: ${error}`);
  }
}

export { startTimer }