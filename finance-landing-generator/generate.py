import json
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

BASE = Path(__file__).resolve().parent
CONFIG = BASE / "config" / "countries.json"
TEMPLATES = BASE / "templates"
OUTPUT = BASE / "output"


def load_config():
    with CONFIG.open("r", encoding="utf-8") as f:
        data = json.load(f)
    return data["countries"]


def build_env():
    return Environment(
        loader=FileSystemLoader(str(TEMPLATES)),
        autoescape=select_autoescape(enabled_extensions=("html", "php")),
    )


def render_country(env, country):
    code = country["code"]
    out_dir = OUTPUT / code
    out_dir.mkdir(parents=True, exist_ok=True)

    mappings = [
        ("guide-finances.html", "guide-finances.php"),
        ("simulateur-pret.html", "simulateur-pret.php"),
        ("gate.html", "gate.html"),
    ]

    for tpl_name, filename in mappings:
        tpl = env.get_template(tpl_name)
        rendered = tpl.render(country=country)
        (out_dir / filename).write_text(rendered, encoding="utf-8")

    print(f"Generated 3 files for {country['name']} in output/{code}/")


def main():
    countries = load_config()
    OUTPUT.mkdir(exist_ok=True)
    env = build_env()

    for country in countries:
        render_country(env, country)

    total = len(countries)
    print(f"Done! Generated {total} countries, {total * 3} files total.")


if __name__ == "__main__":
    main()
