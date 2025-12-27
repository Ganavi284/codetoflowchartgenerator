program SimpleIOCase;

var
  x: integer;

begin
  case x of
    1: writeln('One');
    2: write('Two');
    3: readln(x);
  else
    writeln('Other');
  end;
end.