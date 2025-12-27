program TestFunction;

function Add(a, b: integer): integer;
var
  c: integer;
begin
  c := a + b;
  Result := c;
end;

procedure DisplayMessage(msg: string);
begin
  writeln('Message: ', msg);
end;

begin
  writeln('Testing functions');
  DisplayMessage('Hello World');
  writeln('Result: ', Add(5, 3));
end.