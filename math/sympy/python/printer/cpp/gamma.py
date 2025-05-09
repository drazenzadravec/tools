# https://docs.sympy.org/latest/modules/functions/elementary.html#complex-functions

from sympy.printing import cxxcode
from sympy import pi
from sympy.functions import Min, gamma, sin
from sympy.abc import x
from sympy import sympify

print(cxxcode(Min(gamma(x) - 1, x), standard='C++11'))
print(cxxcode(sin(pi/12), standard='C++11'))

sympy_expr = sympify("x - 0.33333333333333333333*x**3 + 0.2*x**5 - 0.14285714285714285714*x**7 + 0.11111111111111111111*x**9")
cppcode = cxxcode(sympy_expr, standard='C++11')
print(cppcode) 

sympy_expr_1 = sympify("2*x*cos(x**2)")
cppcode_1 = cxxcode(sympy_expr_1, standard='C++11')
print(cppcode_1) 

sympy_expr_2 = sympify("(y**3)**0.33333333333333333333")
cppcode_2 = cxxcode(sympy_expr_2, standard='C++11')
print(cppcode_2) 

# std::min(x, std::tgamma(x) - 1)
# -1.0/4.0*M_SQRT2 + (1.0/4.0)*std::sqrt(6)
# 0.1111*std::pow(x, 9) - 0.1428*std::pow(x, 7) + 0.2*std::pow(x, 5) - 0.3333*std::pow(x, 3) + x
# 2*x*std::cos(std::pow(x, 2))
# std::pow(std::pow(y, 3), 0.33333333333333333)


#There are quite a few constants on offer. See if you can spot the ones that will be useful in quantitative finance:

#   Mathematical    Expression	C++ Symbol	    Decimal Representation
#   pi	            M_PI	                    3.14159265358979323846
#   pi/2	        M_PI_2	                    1.57079632679489661923
#   pi/4	        M_PI_4	                    0.785398163397448309616
#   1/pi	        M_1_PI	                    0.318309886183790671538
#   2/pi	        M_2_PI	                    0.636619772367581343076
#   2/sqrt(pi)	    M_2_SQRTPI	                1.12837916709551257390
#   sqrt(2)	        M_SQRT2	                    1.41421356237309504880
#   1/sqrt(2)	    M_SQRT1_2	                0.707106781186547524401
#   e	            M_E	                        2.71828182845904523536
#   log_2(e)	    M_LOG2E	                    1.44269504088896340736
#   log_10(e)	    M_LOG10E	                0.434294481903251827651
#   log_e(2)	    M_LN2	                    0.693147180559945309417
#   log_e(10)	    M_LN10	                    2.30258509299404568402
