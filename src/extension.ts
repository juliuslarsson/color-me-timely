// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const chooseHeaderColorDisposable = vscode.commands.registerCommand('color-me-timely.chooseColor', async () => {
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
	});

	const applyHeaderColorDisposable = vscode.commands.registerCommand('color-me-timely.applyHeaderColor', async () => {
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
	});

	context.subscriptions.push(chooseHeaderColorDisposable);
	context.subscriptions.push(applyHeaderColorDisposable);

}

// This method is called when your extension is deactivated
export function deactivate() { }
