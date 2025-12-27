program ComplexStatementsInCase;

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
    3: begin
         for i := 1 to 5 do
           writeln('Iteration: ', i);
       end;
  else
    begin
      while x > 0 do
        begin
          writeln('Countdown: ', x);
          x := x - 1;
        end;
    end;
  end;
end.