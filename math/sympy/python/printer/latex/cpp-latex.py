
from sympy import latex, pi, sin, asin, Integral, Matrix, Rational, log
from sympy import sympify

cpp_expr = r"pow(x + 1, 2) + sqrt(3*x - 1)"
expr = sympify(cpp_expr)
mathtex = latex(expr)
print(mathtex) 

# \left(x + 1\right)^{2} + \sqrt{3 x - 1}
