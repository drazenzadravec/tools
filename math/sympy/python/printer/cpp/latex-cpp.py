
from sympy.printing import cxxcode
from sympy import sympify
from latex2sympy2 import latex2sympy, latex2latex

#latex_expr = r"\sqrt{3x-1}+(1+x)^2"
latex_expr = r"\left(x + 1\right)^{2} + \sqrt{3 x - 1}"
symyequ = latex2sympy(latex_expr)
expr = sympify(symyequ)
cppcode = cxxcode(expr, standard='C++11').replace("std::", "")
print(cppcode) 

# pow(x + 1, 2) + sqrt(3*x - 1)
