
from sympy import mathematica_code as mcode, symbols, sin
from sympy import sympify
from latex2sympy2 import latex2sympy, latex2latex

latex_expr = r"\int_{0}^{3} x^{3} \, dx"
symyequ = latex2sympy(latex_expr)
expr = sympify(symyequ)
mat = mcode(expr)
if mat.__contains__("Hold"):
    print(mat.replace("Hold[", "").removesuffix("]"))
else:
    print(mat)

# Integrate[x^3, {x, 0, 3}]
