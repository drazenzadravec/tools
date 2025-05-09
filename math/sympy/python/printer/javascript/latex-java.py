
from sympy import jscode, symbols, Rational, sin, ceiling, Abs
from sympy import sympify
from latex2sympy2 import latex2sympy, latex2latex

latex_expr = r"\sqrt{3x-1}+(1+x)^2"
symyequ = latex2sympy(latex_expr)
expr = sympify(symyequ)
javacode = jscode(expr).replace("Math.", "")
print(javacode) 

# pow(x + 1, 2) + sqrt(3*x - 1)
