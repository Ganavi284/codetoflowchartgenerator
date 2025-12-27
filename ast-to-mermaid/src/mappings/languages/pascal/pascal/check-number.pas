program CheckNumber;
var
  n: integer;
begin
  writeln('Enter a number:');
  readln(n);
  
  if (n >= 0) then
    writeln('Number is Positive')
  else
    writeln('Number is Negative');
end.