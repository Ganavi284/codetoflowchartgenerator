program ElseIfWithBlocks;

var
  n: integer;

begin
  n := 5;

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
  begin
    writeln('Zero');
    writeln('Nothing to show');
  end;

end.