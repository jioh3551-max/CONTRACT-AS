param(
  [int]$Port = 5500
)

$ErrorActionPreference = 'Stop'

function Get-ContentType([string]$path) {
  switch ([System.IO.Path]::GetExtension($path).ToLowerInvariant()) {
    '.html' { 'text/html; charset=utf-8' }
    '.css'  { 'text/css; charset=utf-8' }
    '.js'   { 'application/javascript; charset=utf-8' }
    '.json' { 'application/json; charset=utf-8' }
    '.png'  { 'image/png' }
    '.jpg'  { 'image/jpeg' }
    '.jpeg' { 'image/jpeg' }
    '.gif'  { 'image/gif' }
    '.svg'  { 'image/svg+xml' }
    '.ico'  { 'image/x-icon' }
    default { 'application/octet-stream' }
  }
}

function Send-Response(
  [System.Net.Sockets.NetworkStream]$stream,
  [int]$statusCode,
  [string]$statusText,
  [string]$contentType,
  [byte[]]$body,
  [string]$lastModified,
  [bool]$headOnly
) {
  $headers = [System.Text.StringBuilder]::new()
  [void]$headers.Append("HTTP/1.1 $statusCode $statusText`r`n")
  [void]$headers.Append("Connection: close`r`n")
  [void]$headers.Append("Cache-Control: no-cache, no-store, must-revalidate`r`n")
  [void]$headers.Append("Pragma: no-cache`r`n")
  [void]$headers.Append("Expires: 0`r`n")
  if ($lastModified) { [void]$headers.Append("Last-Modified: $lastModified`r`n") }
  [void]$headers.Append("Content-Type: $contentType`r`n")
  [void]$headers.Append("Content-Length: $($body.Length)`r`n`r`n")

  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers.ToString())
  $stream.Write($headerBytes, 0, $headerBytes.Length)
  if (-not $headOnly -and $body.Length -gt 0) {
    $stream.Write($body, 0, $body.Length)
  }
}

$root = [System.IO.Path]::GetFullPath($PSScriptRoot)
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)

      $requestLine = $reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

      while ($true) {
        $line = $reader.ReadLine()
        if ($line -eq $null -or $line -eq '') { break }
      }

      $parts = $requestLine.Split(' ')
      if ($parts.Length -lt 2) {
        $body = [System.Text.Encoding]::UTF8.GetBytes('Bad Request')
        Send-Response -stream $stream -statusCode 400 -statusText 'Bad Request' -contentType 'text/plain; charset=utf-8' -body $body -lastModified '' -headOnly $false
        continue
      }

      $method = $parts[0].ToUpperInvariant()
      $rawPath = $parts[1]
      $pathOnly = $rawPath.Split('?')[0]
      $relative = [System.Uri]::UnescapeDataString($pathOnly).TrimStart('/')
      if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }

      $target = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
      if (-not $target.StartsWith($root)) {
        $body = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
        Send-Response -stream $stream -statusCode 403 -statusText 'Forbidden' -contentType 'text/plain; charset=utf-8' -body $body -lastModified '' -headOnly ($method -eq 'HEAD')
        continue
      }

      if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
        $body = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
        Send-Response -stream $stream -statusCode 404 -statusText 'Not Found' -contentType 'text/plain; charset=utf-8' -body $body -lastModified '' -headOnly ($method -eq 'HEAD')
        continue
      }

      $file = Get-Item -LiteralPath $target
      $bytes = [System.IO.File]::ReadAllBytes($target)
      $lastModified = $file.LastWriteTimeUtc.ToString('R')
      $contentType = Get-ContentType -path $target

      Send-Response -stream $stream -statusCode 200 -statusText 'OK' -contentType $contentType -body $bytes -lastModified $lastModified -headOnly ($method -eq 'HEAD')
    }
    catch {
      try {
        if ($stream) {
          $body = [System.Text.Encoding]::UTF8.GetBytes('Internal Server Error')
          Send-Response -stream $stream -statusCode 500 -statusText 'Internal Server Error' -contentType 'text/plain; charset=utf-8' -body $body -lastModified '' -headOnly $false
        }
      }
      catch {}
    }
    finally {
      try { $reader.Dispose() } catch {}
      try { $stream.Dispose() } catch {}
      $client.Close()
    }
  }
}
finally {
  $listener.Stop()
}
