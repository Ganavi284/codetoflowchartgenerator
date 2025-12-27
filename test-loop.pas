program TestLoop;
var
  i: integer;
begin
  i := 1;
  while i <= 10 do
  begin
    writeln('Count: ', i);
    i := i + 1;
  end;
  writeln('Done');
end.