from sympy import sympify
from sympy import Symbol, cos

x = Symbol('x')
e = 1/cos(x)
print(e.series(x, 0, 10))

# sympy expression
# 1 + x**2/2 + 5*x**4/24 + 61*x**6/720 + 277*x**8/8064 + O(x**10)

cpp_expr = r"pow(x + 1, 2) + sqrt(3*x - 1)"
expr = sympify(cpp_expr)
print(expr)

# sympy expression
# (x + 1)**2 + sqrt(3*x - 1)
