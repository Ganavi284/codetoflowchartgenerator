program ComplexConditional;
var
  x, y: integer;
begin
  // Complex if-elseif-else chain
  if x < 0 then
    writeln('Negative')
  else if x = 0 then
    writeln('Zero')
  else if x > 10 then
    writeln('Greater than 10')
  else if x > 5 then
    writeln('Between 5 and 10')
  else
    writeln('Between 1 and 5');
    
  // Nested if statements
  if x > 0 then
  begin
    if y > 0 then
      writeln('Both positive')
    else
      writeln('X positive, Y non-positive');
  end
  else
  begin
    if y > 0 then
      writeln('X non-positive, Y positive')
    else
      writeln('Both non-positive');
  end;
  
  // Case statement with ranges
  case x of
    1..5: writeln('Between 1 and 5');
    6, 7, 8: writeln('6, 7, or 8');
    9: writeln('Nine');
    10..15: writeln('Between 10 and 15');
    else writeln('Outside range');
  end;
  
  // Simple case statement
  case y of
    1: writeln('One');
    2: writeln('Two');
    3: writeln('Three');
    else writeln('Other number');
  end;
end.