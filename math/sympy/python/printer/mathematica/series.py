
from sympy import mathematica_code as mcode, symbols, sin
x = symbols('x')
mat = mcode(sin(x).series(x).removeO())
print(mat)

# (1/120)*x^5 - 1/6*x^3 + x
