program SimpleIfElse;

var
  x: integer;

begin
  write('Enter a number: ');
  readln(x);

  if x > 10 then
    writeln('Greater than 10')
  else
    writeln('10 or less');
end.