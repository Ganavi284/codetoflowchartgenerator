program ConditionalCase;

var
  x: integer;

begin
  case x of
    1: begin
         if x > 0 then
           writeln('Positive number')
         else
           writeln('Non-positive number');
       end;
    2: begin
         write('Enter a number: ');
         readln(x);
         writeln('You entered: ', x);
       end;
  else
    begin
      if x = 0 then
        writeln('Zero')
      else
        writeln('Non-zero');
    end;
  end;
end.