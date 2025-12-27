program SimpleElseIf;

var
  n: integer;

begin
  n := 5;

  if n > 0 then
    writeln('Positive')
  else if n < 0 then
    writeln('Negative')
  else
    writeln('Zero');

end.