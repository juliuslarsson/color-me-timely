import * as vscode from 'vscode';

export default async () => {
  const color = context.workspaceState.get('headerColor', '#ff0000');
  console.log(`Applying color ${color} to header.`);

  if (vscode.workspace.workspaceFolders) {
    try {
      await vscode.workspace.getConfiguration().update('workbench.colorCustomizations', {
        "titleBar.activeBackground": color,
        "titleBar.inactiveBackground": color
      }, vscode.ConfigurationTarget.Workspace);
      vscode.window.showInformationMessage(`Header color applied: ${color}`);
    } catch (error) {
      console.error(`Failed to apply header color: ${error}`);
      vscode.window.showErrorMessage(`Failed to apply header color: ${error}`);
    }
  } else {
    vscode.window.showErrorMessage('No workspace is open. Please open a workspace first and try again.');
  }
}