program IfInCaseTest;
var
  x, y: integer;
begin
  x := 2;
  y := 0;
  case x of
    1: writeln('One');
    2: if y > 0 then
         writeln('Positive')
       else
         writeln('Not positive');
  else
    writeln('Other');
  end;
end.