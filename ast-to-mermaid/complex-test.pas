program ComplexFlowchart;

var
  x, y, result: integer;

begin
  x := 10;
  y := 5;
  
  // Nested if statement
  if x > 0 then
  begin
    if y > 0 then
      writeln('Both x and y are positive')
    else
      writeln('x is positive but y is not');
  end
  else
  begin
    writeln('x is not positive');
  end;
  
  // While loop with if statement
  result := 0;
  while result < 3 do
  begin
    if result = 1 then
      writeln('Result is one')
    else
      writeln('Result is not one');
    
    result := result + 1;
  end;
  
  // For loop
  for x := 1 to 5 do
  begin
    writeln('For loop iteration: ', x);
  end;
  
  writeln('Program completed');
end.