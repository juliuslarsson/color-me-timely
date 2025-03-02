import * as vscode from 'vscode';

const resetColor = async (context: vscode.ExtensionContext) => {

  const originalColor = context.workspaceState.get('originalHeaderColor');

  const colorCustomizations = vscode.workspace.getConfiguration('workbench.colorCustomizations');


  const updatedColorCustomizations = {
    ...colorCustomizations,
    "titleBar.activeBackground": originalColor,
    "titleBar.inactiveBackground": originalColor
  };

  await vscode.workspace.getConfiguration().update('workbench.colorCustomizations', updatedColorCustomizations, vscode.ConfigurationTarget.Workspace);
  context.workspaceState.update('headerColor', undefined);
}

export { resetColor }