## Code Formatting

all code should be formatted as:
```shell
python3 -m black file.py --line-length=120 -C -S

## to format all unformatted files
find . -name '*.py' -print0 | xargs -0 python -m black --line-length=120 -C -S
```