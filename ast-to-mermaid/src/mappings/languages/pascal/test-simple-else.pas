program SimpleElse;

var
  n: integer;

begin
  n := 5;

  if n > 0 then
    writeln('Positive')
  else
  begin
    writeln('Zero or Negative');
    writeln('Value = ', n);
  end;

end.