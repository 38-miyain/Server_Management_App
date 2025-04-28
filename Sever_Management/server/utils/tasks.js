const { execSync } = require('child_process');
const path = require('path');

function getEstimatedEndTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  return now.toISOString().replace('T', ' ').substring(0, 16);
}

function getRunningTasks() {
  try {
    const scriptPath = path.join(__dirname, 'getTasks.ps1');
    const output = execSync(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, { encoding: 'utf8' });

    // デバッグ用: PowerShellの出力をログに記録
    console.log('PowerShell Output:', output);

    // JSON部分のみを抽出
    const jsonStartIndex = output.indexOf('['); // JSON配列の開始位置
    if (jsonStartIndex === -1) {
      console.error('PowerShell outputにJSONが含まれていません');
      return [];
    }

    const jsonString = output.substring(jsonStartIndex).trim();
    const json = JSON.parse(jsonString);

    // 必要なデータを整形
    const tasks = (Array.isArray(json) ? json : [json]).map(item => ({
      username: item.username, // PowerShellスクリプトのキー名に合わせる
      task: item.task,
      cpu: item.cpu,
      memory: item.memory
    }));

    return tasks;
  } catch (err) {
    console.error('PowerShell 実行エラー:', err);
    return [];
  }
}

module.exports = { getRunningTasks };