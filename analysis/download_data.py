"""Downloads the UCI Online Retail II dataset into analysis/data/.

The raw file (~45MB) isn't committed to the repo — run this once before
the rest of the pipeline. Source: Chen, Daqing. "Online Retail II."
UCI Machine Learning Repository, https://doi.org/10.24432/C5CG6D.
"""
import io
import zipfile
from pathlib import Path
from urllib.request import urlopen

URL = "https://archive.ics.uci.edu/static/public/502/online+retail+ii.zip"
DATA_DIR = Path(__file__).parent / "data"


def main() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    target = DATA_DIR / "online_retail_II.xlsx"
    if target.exists():
        print(f"{target} already exists, skipping download.")
        return

    print(f"Downloading {URL} ...")
    with urlopen(URL) as response:
        archive = zipfile.ZipFile(io.BytesIO(response.read()))
        archive.extractall(DATA_DIR)
    print(f"Saved to {target}")


if __name__ == "__main__":
    main()
