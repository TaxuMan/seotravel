import json
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path

BASE = Path(__file__).resolve().parent
CONFIG = BASE / "config" / "countries.json"
OUTPUT = BASE / "output"


class TagValidator(HTMLParser):
    VOID = {
        "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr",
    }

    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if not self.stack:
            self.errors.append(f"Unexpected closing tag: </{tag}>")
            return
        open_tag = self.stack.pop()
        if open_tag != tag:
            self.errors.append(f"Mismatched tag: opened <{open_tag}>, closed </{tag}>")

    def close(self):
        super().close()
        if self.stack:
            self.errors.append(f"Unclosed tags: {self.stack}")


def load_countries():
    with CONFIG.open("r", encoding="utf-8") as f:
        return json.load(f)["countries"]


def assert_file(path: Path):
    if not path.exists():
        raise AssertionError(f"Missing file: {path}")


def validate_html(path: Path):
    content = path.read_text(encoding="utf-8")
    parser = TagValidator()
    parser.feed(content)
    parser.close()
    if parser.errors:
        raise AssertionError(f"HTML errors in {path}: {parser.errors}")

    if "{{" in content:
        raise AssertionError(f"Unrendered Jinja markers in {path}")


def validate_links(country, guide_path: Path, sim_path: Path):
    guide = guide_path.read_text(encoding="utf-8")
    sim = sim_path.read_text(encoding="utf-8")

    if country["simulator_path"] not in guide:
        raise AssertionError(f"Guide link mismatch for {country['code']}")
    if country["subdomain_path"] not in sim:
        raise AssertionError(f"Simulator back link mismatch for {country['code']}")


def main():
    subprocess.run(["python", "generate.py"], cwd=BASE, check=True)
    countries = load_countries()

    for c in countries:
        code = c["code"]
        country_dir = OUTPUT / code
        guide = country_dir / "guide-finances.php"
        sim = country_dir / "simulateur-pret.php"
        gate = country_dir / "gate.html"

        for p in (guide, sim, gate):
            assert_file(p)
            validate_html(p)

        validate_links(c, guide, sim)

    print(f"All tests passed for {len(countries)} countries.")


if __name__ == "__main__":
    main()
