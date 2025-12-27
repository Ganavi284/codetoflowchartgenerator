program ConditionalCaseTest;

var
  x: integer;

begin
  case x of
    1: if x > 0 then
         writeln('Positive')
       else
         writeln('Non-positive');
    2: begin
         write('Enter value: ');
         readln(x);
       end;
  else
    if x = 0 then
      writeln('Zero')
    else
      writeln('Non-zero');
  end;
end.