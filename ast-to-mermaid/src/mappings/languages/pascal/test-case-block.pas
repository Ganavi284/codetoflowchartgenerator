program CaseBlock;
var
  n: integer;
begin
  write('Enter a number: ');
  readln(n);

  case n of
    1:
      begin
        writeln('One');
        writeln('Odd number');
      end;
    2:
      begin
        writeln('Two');
        writeln('Even number');
      end;
  else
      writeln('Other number');
  end;
end.