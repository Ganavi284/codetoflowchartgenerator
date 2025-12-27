program TestLoops;
var
  i, j: integer;
begin
  // For loop
  for i := 1 to 5 do
    writeln('For loop iteration: ', i);
    
  // While loop
  j := 0;
  while j < 3 do
  begin
    writeln('While loop iteration: ', j);
    j := j + 1;
  end;
  
  // Repeat-until loop
  i := 5;
  repeat
    writeln('Repeat loop iteration: ', i);
    i := i - 1;
  until i = 0;
  
  writeln('All loops completed');
end.