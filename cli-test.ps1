# Test the AST-to-Mermaid service with JavaScript code containing if statement
$Url = "http://localhost:3400/convert"

# JavaScript code with if statement
$JsCode = @"
let x = prompt('Enter a number:');
x = Number(x);
if (x > 0) {
  console.log('Positive');
}
"@

# Create the request body
$Body = @{
    code = $JsCode
    language = "javascript"
} | ConvertTo-Json

# Send the POST request
try {
    Write-Host "Sending request to AST-to-Mermaid service..."
    $Response = Invoke-RestMethod -Uri $Url -Method Post -Body $Body -ContentType "application/json"
    
    Write-Host "Response received successfully!" -ForegroundColor Green
    Write-Host "Language: $($Response.language)"
    
    # Decode and display the mermaid chart
    $MermaidChart = $Response.mermaid
    Write-Host "`nGenerated Mermaid Flowchart:" -ForegroundColor Yellow
    Write-Host $MermaidChart
    
    # Save to file for viewing
    $MermaidChart | Out-File -FilePath "cli-test-output.mmd" -Encoding UTF8
    Write-Host "`nFlowchart saved to cli-test-output.mmd" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}