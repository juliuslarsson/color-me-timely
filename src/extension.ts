// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { setTargetColor, setStartColor, startTimer, resetColor } from './commands';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const setTargetColorDisposable = vscode.commands.registerCommand('color-me-timely.setTargetColor', async () => {
		await setTargetColor(context);
	});

	const setStartColorDisposable = vscode.commands.registerCommand('color-me-timely.setStartColor', async () => {
		await setStartColor(context);
	});

	const resetHeaderColorDisposable = vscode.commands.registerCommand('color-me-timely.resetColor', async () => {
		await resetColor(context);
	});

	const startTimerDisposable = vscode.commands.registerCommand('color-me-timely.startTimer', async () => {
		const tokenSource = new vscode.CancellationTokenSource();
		const token = tokenSource.token;

		try {

			startTimer(context, token);

			vscode.commands.registerCommand('color-me-timely.cancelTimer', async () => {
				tokenSource.cancel();
				await resetColor(context);
			});
		} catch (error) { }

	});

	context.subscriptions.push(setStartColorDisposable);
	context.subscriptions.push(setTargetColorDisposable);
	context.subscriptions.push(startTimerDisposable);
	context.subscriptions.push(resetHeaderColorDisposable);

}

export function deactivate() { }
