program IfElseExample;

var
  n: integer;

begin
  write('Enter a number: ');
  readln(n);

  if n mod 2 = 0 then
    writeln('Even number')
  else
    writeln('Odd number');

end.