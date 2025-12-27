program SimpleTest;
var
  x: integer;
begin
  x := 1;
  case x of
    1: writeln('One');
  else
    writeln('Other');
  end;
end.