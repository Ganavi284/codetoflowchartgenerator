program TestComplexNesting;

var
  a, b: integer;

begin
  a := 2;
  b := 0;
  
  case a of
    1: writeln('One');
    2: begin
         if b > 0 then
           writeln('b is positive')
         else if b < 0 then
           writeln('b is negative')
         else
           writeln('b is zero');
       end;
  else
    writeln('Other number');
  end;

end.