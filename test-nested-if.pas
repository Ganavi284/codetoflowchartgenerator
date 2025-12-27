program TestNestedIf;

var
  a, b: integer;

begin
  write('Enter two numbers: ');
  readln(a, b);

  if a > 0 then
    if b > 0 then
      writeln('Both positive')
    else
      writeln('A positive, B non-positive')
  else if a < 0 then
    writeln('A negative')
  else
    writeln('A is zero');
end.