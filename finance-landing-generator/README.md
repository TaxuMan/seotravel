# Finance Landing Generator

Generate localized landing pages (`guide-finances.php`, `simulateur-pret.php`, `gate.html`) from `config/countries.json`.

## Setup

```bash
pip install jinja2
```

## Usage

```bash
python generate.py
```

## Test

```bash
python test.py
```

## Output

Generated files are written to `output/{country_code}/`.
