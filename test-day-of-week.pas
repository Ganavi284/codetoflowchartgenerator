program DayOfWeek;
var
  day: integer;
begin
  write('Enter day number (1-7): ');
  readln(day);
  
  case day of
    1: writeln('Sunday');
    2: writeln('Monday');
    3: writeln('Tuesday');
    4: writeln('Wednesday');
    5: writeln('Thursday');
    6: writeln('Friday');
    7: writeln('Saturday');
  else
    writeln('Invalid day');
  end;
end.