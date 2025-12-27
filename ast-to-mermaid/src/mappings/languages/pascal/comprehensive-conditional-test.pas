program ComprehensiveConditionalTest;
var
  x, y: integer;
begin
  // Simple if statement
  if x < 0 then
    writeln('Negative number');
    
  // If-else statement
  if y > 10 then
    writeln('Greater than 10')
  else
    writeln('Less than or equal to 10');
    
  // Else-if chain
  if x < 0 then
    writeln('Negative')
  else if x = 0 then
    writeln('Zero')
  else
    writeln('Positive');
    
  // Case statement with ranges and else
  case y of
    1..5: writeln('Small number');
    6..10: writeln('Medium number');
    11..15: writeln('Large number');
    else writeln('Very large or small number');
  end;
  
  // Simple case statement
  case x of
    1: writeln('One');
    2: writeln('Two');
    3: writeln('Three');
  end;
end.