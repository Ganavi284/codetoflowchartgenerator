program TestFlowchart;

var
  i, sum: integer;

begin
  sum := 0;
  
  for i := 0 to 4 do
  begin
    sum := sum + i;
    
    if i > 2 then
      writeln('i is greater than 2: ', i)
    else
      writeln('i is less than or equal to 2: ', i);
  end;
  
  writeln('Final sum: ', sum);
end.