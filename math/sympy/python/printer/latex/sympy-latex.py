
from sympy import latex, pi, sin, asin, Integral, Matrix, Rational, log
from sympy import sympify

sympy_expr = r"(x + 1.0)**2 + (3.0*x - 1.0)**0.5"
expr = sympify(sympy_expr)
sympytex = latex(expr)
print(sympytex) 

# \left(x + 1.0\right)^{2} + \left(3.0 x - 1.0\right)^{0.5}
