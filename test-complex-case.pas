program ComplexCase;

var
  choice: integer;

begin
  write('Enter choice: ');
  readln(choice);

  case choice of
    1: begin
         writeln('You selected option 1');
         writeln('This is a multi-line case');
       end;
    2: begin
         writeln('You selected option 2');
         choice := choice + 1;
       end;
    3: writeln('Simple single line case');
  else
    begin
      writeln('Invalid choice');
      choice := 0;
    end;
  end;

end.