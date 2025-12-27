program PascalLoops;

var
  i, j: integer;
  sum: integer;

begin
  sum := 0;
  
  // For loop
  for i := 1 to 5 do
    sum := sum + i;
  
  // While loop
  j := 0;
  while j < 5 do
  begin
    sum := sum + j;
    j := j + 1;
  end;
  
  // Repeat-until loop
  repeat
    sum := sum - 1;
    j := j - 1;
  until j <= 0;
  
  writeln('Sum: ', sum);
end.