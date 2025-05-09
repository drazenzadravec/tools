from sympy import *
from sympy import sympify

import argparse

# def main():
#     parser = argparse.ArgumentParser(description="A simple example script.")
#     parser.add_argument('name', type=str, help='Your name')
#     parser.add_argument('age', type=int, help='Your age')
#     parser.add_argument('--greet', action='store_true', help='Include a greeting message')

#     args = parser.parse_args()

#     if args.greet:
#         print(f"Hello, {args.name}! You are {args.age} years old.")
#     else:
#         print(f"{args.name}, you are {args.age} years old.")

def main():
    parser = argparse.ArgumentParser(description="A simple example script.")
    parser.add_argument('expression', type=str, help='Math expression')

    args = parser.parse_args()
    expr = sympify(args.expression)

    # evaluating the expression 
    print(expr.evalf(20)) 

if __name__ == "__main__":
    main()
