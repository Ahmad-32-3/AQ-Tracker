"""Darker grainy parchment + soft wrinkles throughout (not Voronoi, not flat)."""
from __future__ import annotations

import math
import random
import struct
import zlib
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "textures"


def fade(t: float) -> float:
    return t * t * t * (t * (t * 6 - 15) + 10)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def make_grid(rng: random.Random, nx: int, ny: int) -> list[list[float]]:
    return [[rng.random() * 2 - 1 for _ in range(ny + 1)] for _ in range(nx + 1)]


def sample(grid: list[list[float]], nx: int, ny: int, x: float, y: float) -> float:
    fx = x * nx
    fy = y * ny
    x0 = int(fx) % nx
    y0 = int(fy) % ny
    x1 = (x0 + 1) % nx
    y1 = (y0 + 1) % ny
    tx = fade(fx - int(fx))
    ty = fade(fy - int(fy))
    return lerp(
        lerp(grid[x0][y0], grid[x1][y0], tx),
        lerp(grid[x0][y1], grid[x1][y1], tx),
        ty,
    )


def fbm(grids: list[tuple[list[list[float]], int, int, float]], x: float, y: float) -> float:
    return sum(sample(g, nx, ny, x, y) * amp for g, nx, ny, amp in grids)


def write_png_rgb(path: Path, width: int, height: int, pixels: bytes) -> None:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(pixels, 9))
        + chunk(b"IEND", b"")
    )
    path.write_bytes(png)
    print(f"wrote {path} ({len(png)} bytes)")


def soft_wrinkle_map(w: int, h: int, seed: int) -> bytes:
    """
    Soft wrinkles everywhere — visible hills/valleys, no sharp crease web.
    Mid-dark grayscale for multiply over brown parchment.
    """
    rng = random.Random(seed)
    g_warp = [
        (make_grid(rng, 3, 2), 3, 2, 0.6),
        (make_grid(rng, 6, 4), 6, 4, 0.35),
    ]
    # Medium-scale undulations = soft crumpled sheet
    g_fold = [
        (make_grid(rng, 5, 4), 5, 4, 0.55),
        (make_grid(rng, 10, 7), 10, 7, 0.4),
        (make_grid(rng, 18, 12), 18, 12, 0.28),
        (make_grid(rng, 32, 22), 32, 22, 0.16),
    ]
    # Fine continuous wrinkle web (soft, not crack lines)
    g_wrinkle = [
        (make_grid(rng, 40, 28), 40, 28, 0.45),
        (make_grid(rng, 70, 48), 70, 48, 0.28),
    ]
    g_grain = [
        (make_grid(rng, 90, 60), 90, 60, 0.5),
        (make_grid(rng, 140, 95), 140, 95, 0.35),
    ]

    height = [[0.0] * w for _ in range(h)]
    for y in range(h):
        yn = y / (h - 1)
        for x in range(w):
            xn = x / (w - 1)
            wx = xn + fbm(g_warp, xn, yn) * 0.1
            wy = yn + fbm(g_warp, xn + 2.0, yn + 1.5) * 0.1
            height[y][x] = fbm(g_fold, wx, wy) + fbm(g_wrinkle, wx, wy) * 0.55

    lx, ly, lz = -0.4, -0.5, 0.8
    out = bytearray()
    for y in range(h):
        out.append(0)
        yn = y / (h - 1)
        for x in range(w):
            xn = x / (w - 1)
            hh = height[y][x]
            hx = height[y][min(w - 1, x + 2)]
            hy = height[min(h - 1, y + 2)][x]
            dx = (hx - hh) * 14
            dy = (hy - hh) * 14
            nxn, nyn, nzn = -dx, -dy, 1.0
            inv = 1.0 / math.sqrt(nxn * nxn + nyn * nyn + nzn * nzn + 1e-8)
            ndotl = max(0.0, (nxn * lx + nyn * ly + nzn * lz) * inv)

            grain = fbm(g_grain, xn, yn)

            # Darker midtones + soft ridge/valley contrast (readable wrinkles)
            lit = 0.38 + 0.48 * ndotl + grain * 0.08
            # Soft valley darkening throughout
            lit -= max(0.0, -hh) * 0.16
            lit += max(0.0, hh) * 0.06

            c = int(max(35, min(220, lit * 255)))
            out.extend((c, c, c))
    return bytes(out)


def grain_overlay(w: int, h: int, seed: int) -> bytes:
    """Fine paper grain + very soft fold for soft-light layer."""
    rng = random.Random(seed)
    g_fold = [
        (make_grid(rng, 6, 4), 6, 4, 0.5),
        (make_grid(rng, 12, 8), 12, 8, 0.35),
        (make_grid(rng, 24, 16), 24, 16, 0.2),
    ]
    g_grain = [
        (make_grid(rng, 80, 55), 80, 55, 0.55),
        (make_grid(rng, 130, 90), 130, 90, 0.4),
    ]

    height = [[0.0] * w for _ in range(h)]
    for y in range(h):
        yn = y / (h - 1)
        for x in range(w):
            xn = x / (w - 1)
            height[y][x] = fbm(g_fold, xn, yn)

    lx, ly, lz = -0.35, -0.45, 0.82
    out = bytearray()
    for y in range(h):
        out.append(0)
        yn = y / (h - 1)
        for x in range(w):
            xn = x / (w - 1)
            hh = height[y][x]
            hx = height[y][min(w - 1, x + 3)]
            hy = height[min(h - 1, y + 3)][x]
            dx = (hx - hh) * 9
            dy = (hy - hh) * 9
            nxn, nyn, nzn = -dx, -dy, 1.0
            inv = 1.0 / math.sqrt(nxn * nxn + nyn * nyn + nzn * nzn + 1e-8)
            ndotl = max(0.0, (nxn * lx + nyn * ly + nzn * lz) * inv)
            grain = fbm(g_grain, xn, yn)
            v = 0.5 + (ndotl - 0.5) * 0.35 + grain * 0.08
            c = int(max(70, min(200, v * 255)))
            out.extend((c, c, c))
    return bytes(out)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    w, h = 1600, 1000
    write_png_rgb(OUT / "crumpled-paper.png", w, h, soft_wrinkle_map(w, h, seed=42))
    write_png_rgb(OUT / "paper-creases.png", w, h, grain_overlay(w, h, seed=88))


if __name__ == "__main__":
    main()
