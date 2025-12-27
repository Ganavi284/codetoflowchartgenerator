program TestAllLoops;
var
  i, j, k: integer;
begin
  // Simple for loop with to
  for i := 1 to 10 do
    writeln('Counting up: ', i);
    
  // For loop with downto
  for j := 10 downto 1 do
    writeln('Counting down: ', j);
    
  // Nested for loops
  for i := 1 to 3 do
  begin
    for j := 1 to 2 do
      writeln('Nested loop: i=', i, ' j=', j);
  end;
  
  // While loop
  k := 0;
  while k < 5 do
  begin
    writeln('While loop: ', k);
    k := k + 1;
  end;
  
  // Repeat-until loop
  k := 5;
  repeat
    writeln('Repeat loop: ', k);
    k := k - 1;
  until k = 0;
  
  // While loop with complex condition
  i := 1;
  j := 10;
  while (i < 5) and (j > 5) do
  begin
    writeln('Complex condition loop: i=', i, ' j=', j);
    i := i + 1;
    j := j - 1;
  end;
  
  writeln('All loops completed');
end.