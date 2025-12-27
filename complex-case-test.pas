program ComplexCaseTest;

var
  x: integer;

begin
  case x of
    1: begin
         writeln('One');
       end;
    2: begin
         writeln('Two');
       end;
  else
    begin
      writeln('Other');
    end;
  end;
end.