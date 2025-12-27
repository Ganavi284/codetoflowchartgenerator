program TestComplexElseIf;
var
  x: integer;
begin
  if x < 0 then
    writeln('Negative')
  else if x = 0 then
    writeln('Zero')
  else if x = 1 then
    writeln('One')
  else if x = 2 then
    writeln('Two')
  else
    writeln('Other positive number');
end.