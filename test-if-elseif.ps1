# Test the AST-to-Mermaid service with JavaScript code containing if-elseif statement
$Url = "http://localhost:3400/convert"

# Read the JavaScript code with if-elseif statement
$JsCode = Get-Content -Path "test-if-elseif.js" -Raw

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
    $MermaidChart | Out-File -FilePath "if-elseif-output.mmd" -Encoding UTF8
    Write-Host "`nFlowchart saved to if-elseif-output.mmd" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}