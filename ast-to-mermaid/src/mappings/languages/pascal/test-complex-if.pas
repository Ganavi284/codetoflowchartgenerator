program JobEligibility;

var
  age: integer;

begin
  write('Enter age: ');
  readln(age);

  if (age >= 18) and (age <= 60) then
    writeln('Eligible for job')
  else if age > 60 then
    writeln('Retired')
  else
    writeln('Not eligible');

end.