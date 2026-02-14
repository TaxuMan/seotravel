import json
import re
from pathlib import Path


def select_autoescape(enabled_extensions=()):
    return None


class FileSystemLoader:
    def __init__(self, searchpath):
        self.searchpath = Path(searchpath)

    def load(self, template_name):
        return (self.searchpath / template_name).read_text(encoding="utf-8")


class Environment:
    def __init__(self, loader, autoescape=None):
        self.loader = loader

    def get_template(self, template_name):
        return Template(self.loader.load(template_name))


class Template:
    FOR_RE = re.compile(r"{%\s*for\s+(\w+)\s+in\s+([^%]+?)\s*%}(.*?){%\s*endfor\s*%}", re.S)
    VAR_RE = re.compile(r"{{\s*(.*?)\s*}}", re.S)

    def __init__(self, text):
        self.text = text

    def render(self, **context):
        return self._render_block(self.text, context)

    def _resolve(self, expr, context):
        expr = expr.strip()
        if expr.startswith("'") and expr.endswith("'"):
            return expr[1:-1]
        parts = expr.split(".")
        value = context.get(parts[0])
        for part in parts[1:]:
            if isinstance(value, dict):
                value = value.get(part)
            else:
                value = getattr(value, part)
        return value

    def _render_vars(self, text, context):
        def repl(match):
            expr = match.group(1).strip()
            filters = []
            if "|" in expr:
                chunks = [c.strip() for c in expr.split("|")]
                expr = chunks[0]
                filters = chunks[1:]
            val = self._resolve(expr, context)
            for f in filters:
                if f == "tojson":
                    val = json.dumps(val, ensure_ascii=False)
                elif f == "safe":
                    pass
            return "" if val is None else str(val)

        return self.VAR_RE.sub(repl, text)

    def _render_block(self, block, context):
        while True:
            m = self.FOR_RE.search(block)
            if not m:
                break
            var_name, iterable_expr, body = m.groups()
            iterable = self._resolve(iterable_expr.strip(), context) or []
            rendered = []
            for item in iterable:
                child = dict(context)
                child[var_name] = item
                rendered.append(self._render_block(body, child))
            block = block[: m.start()] + "".join(rendered) + block[m.end() :]
        return self._render_vars(block, context)
