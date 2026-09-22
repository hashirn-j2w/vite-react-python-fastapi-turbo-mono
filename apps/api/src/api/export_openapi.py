"""Write the OpenAPI schema to disk: `uv run python -m api.export_openapi [output]`.

`openapi.json` is what `@workspace/api-client` generates the TS client from.
"""

import argparse
import json
from pathlib import Path

from api.main import app


def main() -> None:
    parser = argparse.ArgumentParser(description="Export the FastAPI OpenAPI schema.")
    parser.add_argument("output", nargs="?", type=Path, default=Path("openapi.json"))
    output: Path = parser.parse_args().output

    schema = json.dumps(app.openapi(), indent=2, ensure_ascii=False) + "\n"
    output.write_text(schema, encoding="utf-8", newline="\n")
    print(f"OpenAPI schema written to {output}")


if __name__ == "__main__":
    main()
