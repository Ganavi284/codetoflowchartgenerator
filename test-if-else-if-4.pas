program TestFourConditions;

var
  temperature: integer;

begin
  write('Enter temperature: ');
  readln(temperature);

  if temperature >= 100 then
    writeln('Boiling')
  else if temperature >= 50 then
    writeln('Hot')
  else if temperature >= 10 then
    writeln('Warm')
  else if temperature >= 0 then
    writeln('Cold')
  else
    writeln('Freezing');
end.