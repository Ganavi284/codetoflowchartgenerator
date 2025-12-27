program FunctionCalls;

function CalculateSquare(x: integer): integer;
begin
  CalculateSquare := x * x;
end;

function CalculateSum(a, b: integer): integer;
begin
  CalculateSum := a + b;
end;

procedure DisplayResult(value: integer);
begin
  writeln('Result: ', value);
end;

begin
  var num1 := 5;
  var num2 := 3;
  var square := CalculateSquare(num1);
  var sum := CalculateSum(num1, num2);
  DisplayResult(square);
  DisplayResult(sum);
end.