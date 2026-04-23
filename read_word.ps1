Add-Type -AssemblyName System.IO.Compression.FileSystem
$file = Get-ChildItem "C:\Users\ADmin\Downloads\*baocao_bigdata*.docx" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($file) {
    Write-Host "Đọc file: $($file.FullName)"
    $zip = [System.IO.Compression.ZipFile]::OpenRead($file.FullName)
    $docXml = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
    
    if ($docXml) {
        $stream = $docXml.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $text = $reader.ReadToEnd()
        $stream.Close()
        $zip.Dispose()
        
        # Parse XML (đơn giản, gom tất cả thẻ w:t lại)
        $text = $text -replace '<[^>]+>', '|'
        $words = $text.Split('|', [System.StringSplitOptions]::RemoveEmptyEntries)
        $fullText = $words -join ''
        
        Write-Host "--- NỘI DUNG TÌM ĐƯỢC ---"
        # Tìm chữ Chương 4
        $idx = $fullText.IndexOf("CHƯƠNG 4", [System.StringComparison]::OrdinalIgnoreCase)
        if ($idx -eq -1) {
             $idx = $fullText.IndexOf("Chương 4", [System.StringComparison]::OrdinalIgnoreCase)
        }
        
        if ($idx -ge 0) {
            Write-Host $fullText.Substring($idx, [math]::Min(3000, $fullText.Length - $idx))
        } else {
            Write-Host "Không tìm thấy chữ Chương 4, in ra đầu file:"
            Write-Host $fullText.Substring(0, [math]::Min(3000, $fullText.Length))
        }
    }
} else {
    Write-Host "Không tìm thấy file baocao_bigdata.docx trong Downloads"
}
