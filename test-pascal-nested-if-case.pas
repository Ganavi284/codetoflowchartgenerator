program CaseCalculator;

var
  a, b: integer;
  choice: integer;

begin
  writeln('1. Add');
  writeln('2. Subtract');
  writeln('3. Multiply');
  writeln('4. Divide');

  write('Enter choice: ');
  readln(choice);

  write('Enter two numbers: ');
  readln(a, b);

  case choice of
    1: writeln('Result = ', a + b);
    2: writeln('Result = ', a - b);
    3: writeln('Result = ', a * b);
    4: if b <> 0 then
         writeln('Result = ', a div b)
       else
         writeln('Division by zero');
  else
    writeln('Invalid choice');
  end;
end.