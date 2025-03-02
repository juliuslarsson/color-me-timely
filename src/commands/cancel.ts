import * as vscode from 'vscode';
import { startTimer } from './start-timer';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.startTimer', async () => {
    const tokenSource = new vscode.CancellationTokenSource();
    const token = tokenSource.token;

    // Start the timer
    startTimer(context, token);

    // Optionally, provide a way to cancel the timer
    vscode.commands.registerCommand('extension.cancelTimer', () => {
      tokenSource.cancel();
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }