// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import chooseColor from './commands/choose-color';
import applyColor from './commands/apply-color';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const chooseHeaderColorDisposable = vscode.commands.registerCommand('color-me-timely.chooseColor', async () => {
		await chooseColor(context);
	});

	const applyHeaderColorDisposable = vscode.commands.registerCommand('color-me-timely.applyHeaderColor', async () => {
		await applyColor(context);
	});

	context.subscriptions.push(chooseHeaderColorDisposable);
	context.subscriptions.push(applyHeaderColorDisposable);

}

// This method is called when your extension is deactivated
export function deactivate() { }
