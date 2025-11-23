# Define the URL and payload
$Url = "http://localhost:3400/convert"
$Body = @{
    code = "let x = prompt('Enter a number:');`nx = Number(x);`nif (x > 0) {`n  console.log('Positive');`n}"
    language = "javascript"
} | ConvertTo-Json

# Send the POST request
try {
    $Response = Invoke-RestMethod -Uri $Url -Method Post -Body $Body -ContentType "application/json"
    Write-Host "Response received:"
    Write-Host ($Response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error occurred:"
    Write-Host $_.Exception.Message
}