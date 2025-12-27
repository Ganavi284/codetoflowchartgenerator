program MultipleStatements;

var
  n: integer;

begin
  write('Enter a number: ');
  readln(n);

  if n > 0 then
  begin
    writeln('Positive number');
    writeln('Value = ', n);
  end
  else if n < 0 then
  begin
    writeln('Negative number');
    writeln('Value = ', n);
  end
  else
    writeln('Zero');

end.