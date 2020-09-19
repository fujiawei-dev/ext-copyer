import { count } from 'console';
import * as vscode from 'vscode';

const isWin32 = process.platform === 'win32';
const delimiter = isWin32 ? '\r\n' : '\n';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('copyer.copyUnixStyleRelativePath', (arg1, arg2) => {
		copyUnixStyleRelativePath(context, arg1, arg2);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }

export function copyUnixStyleRelativePath(context: vscode.ExtensionContext, arg1: vscode.Uri, arg2: vscode.Uri[] | undefined) {
	let resources: vscode.Uri[] | undefined;

	if (Array.isArray(arg2) && arg2) {
		resources = arg2;
	} else if (arg1) {
		resources = [arg1];
	} else if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri) {
		resources = [vscode.window.activeTextEditor.document.uri];
	}

	if (!resources) { return; }

	const relativePaths: string[] = [];
	for (const resource of resources) {
		const relativePath = vscode.workspace.asRelativePath(resource, false);
		if (!relativePath) { return; }
		relativePaths.push(isWin32 ? relativePath.replace(/\\/g, '/') : relativePath);

		console.log(resource);
		console.log(relativePath);
	}

	if (relativePaths.length === 0) { return; }

	vscode.env.clipboard.writeText(relativePaths.join(delimiter));
}
