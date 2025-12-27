program TestElseSeparation;

var
  x, y: integer;

begin
  x := 5;
  y := 0;
  
  case x of
    1: writeln('One');
    2: if y > 0 then
         writeln('y is positive')
       else
         writeln('y is not positive');
    3: writeln('Three');
  else
    writeln('Other number');
  end;

end.