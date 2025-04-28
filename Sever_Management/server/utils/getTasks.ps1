try {
    $processes = Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
    Write-Host "Processes fetched: $($processes.Count)"

    $tasks = @()

    foreach ($p in $processes) {
        try {
            Write-Host "Processing PID: $($p.Id)"
            $cim = Get-CimInstance -Query "SELECT * FROM Win32_Process WHERE ProcessId = $($p.Id)"
            $owner = $cim | Invoke-CimMethod -MethodName GetOwner

            # CPU使用率を取得
            $cpuCounter = Get-Counter "\Process($($p.ProcessName))\% Processor Time"
            $cpuUsage = ($cpuCounter.CounterSamples[0].CookedValue / (Get-CimInstance Win32_Processor).NumberOfLogicalProcessors)

            # メモリ使用量を計算
            $memoryUsageGB = [math]::Round($p.WorkingSet / 1GB, 2)

            $task = [PSCustomObject]@{
                username = "$($owner.Domain)\$($owner.User)" # ユーザー名
                task     = $p.ProcessName                   # プロセス名
                cpu      = "{0:N2}%" -f $cpuUsage           # CPU使用率
                memory   = "{0:N2} GB" -f $memoryUsageGB    # メモリ使用量
            }
            $tasks += $task
        } catch {
            Write-Host "Error processing PID $($p.Id): $_"
            continue
        }
    }
} catch {
    Write-Error "Error in main try block: $_"
}

$tasks | ConvertTo-Json -Depth 3