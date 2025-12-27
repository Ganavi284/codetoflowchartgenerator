program EnhancedTest;

var
  n: integer;

begin
  write('Enter a number: ');
  readln(n);

  if n >= 0 then
    writeln('Number is Positive')
  else
    writeln('Number is Negative');
    
  writeln('Program completed.');
end.