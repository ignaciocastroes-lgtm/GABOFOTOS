import cairosvg, io
from PIL import Image

ROJO="#CC1A1D"; ROJO_OSC="#8E1215"; NEGRO="#111111"; BLANCO="#FFFFFF"
F="DejaVu Sans Condensed"; S=1000
CLIP = '<defs><clipPath id="tro"><circle cx="500" cy="500" r="472"/></clipPath></defs>' 
ESCUDO = Image.open("/home/claude/proyecto/public/escudo.webp").convert("RGBA")

def chuecas(cx, cy, esc, color, gw=9):
    """Dos chuecas cruzadas en X: mango recto + pala curva."""
    palo = f'M0,-52 L0,26 Q0,44 18,44 L40,44'
    return f'''<g transform="translate({cx},{cy}) scale({esc})" stroke="{color}"
        stroke-width="{gw}" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="{palo}" transform="rotate(-28)"/>
      <path d="{palo}" transform="rotate(28) scale(-1,1)"/>
    </g>'''

def render(svg, nombre, escudo_box=None):
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=S, output_height=S)
    im = Image.open(io.BytesIO(png)).convert("RGBA")
    if escudo_box:
        x,y,w = escudo_box
        im.alpha_composite(ESCUDO.resize((w,w), Image.LANCZOS), (x,y))
    im.save(f"{nombre}.png")
    plano = Image.new("RGB", im.size, (255,255,255)); plano.paste(im, mask=im.split()[3])
    plano.save(f"{nombre}.webp","WEBP",quality=88,method=6)
    print(f"  {nombre}")

# 1 · Escudo troquelado
render(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}">{CLIP}<g clip-path="url(#tro)">
  <circle cx="500" cy="500" r="472" fill="{BLANCO}"/>
  <circle cx="500" cy="500" r="472" fill="none" stroke="{NEGRO}" stroke-width="5" opacity=".12"/>
</g></svg>''', "sticker-escudo", (70,70,860))

# 2 · Vamos Inter
render(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}">{CLIP}<g clip-path="url(#tro)">
  <circle cx="500" cy="500" r="472" fill="{NEGRO}"/>
  <circle cx="500" cy="500" r="440" fill="{ROJO}"/>
  <rect x="60" y="596" width="880" height="168" fill="{NEGRO}"/>
  <text x="500" y="352" font-family="{F}" font-size="152" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="8">VAMOS</text>
  {chuecas(500,470,1.45,BLANCO)}
  <text x="500" y="726" font-family="{F}" font-size="184" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="16">INTER</text>
  <text x="500" y="856" font-family="{F}" font-size="46" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="12" opacity=".85">HOCKEY PATIN</text>
</g></svg>''', "sticker-vamos-inter")

# 3 · Qué lindo es ser del Inter
render(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}">{CLIP}<g clip-path="url(#tro)">
  <circle cx="500" cy="500" r="472" fill="{BLANCO}"/>
  <circle cx="500" cy="500" r="472" fill="none" stroke="{ROJO}" stroke-width="28"/>
  <circle cx="500" cy="500" r="424" fill="none" stroke="{NEGRO}" stroke-width="7"/>
  {chuecas(500,268,1.15,ROJO,10)}
  <text x="500" y="440" font-family="{F}" font-size="106" font-weight="bold"
        fill="{NEGRO}" text-anchor="middle">QUE LINDO</text>
  <text x="500" y="536" font-family="{F}" font-size="106" font-weight="bold"
        fill="{NEGRO}" text-anchor="middle">ES SER</text>
  <rect x="146" y="580" width="708" height="132" fill="{ROJO}"/>
  <text x="500" y="682" font-family="{F}" font-size="114" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="10">DEL INTER</text>
  <text x="500" y="810" font-family="{F}" font-size="50" font-weight="bold"
        fill="{NEGRO}" text-anchor="middle" letter-spacing="12">LO ESPEJO</text>
</g></svg>''', "sticker-que-lindo")

# 4 · San Juan 2026
render(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}">{CLIP}<g clip-path="url(#tro)">
  <circle cx="500" cy="500" r="472" fill="{NEGRO}"/>
  <path d="M0,760 L170,600 L300,715 L470,555 L640,720 L790,610 L1000,780 L1000,1000 L0,1000 Z"
        fill="{ROJO_OSC}"/>
  <path d="M0,830 L210,690 L390,815 L560,675 L730,805 L890,700 L1000,790 L1000,1000 L0,1000 Z"
        fill="{ROJO}"/>
  <text x="500" y="560" font-family="{F}" font-size="40" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="16" opacity=".75">LO ESPEJO</text>
  <g stroke="{BLANCO}" stroke-width="4" opacity=".55" fill="none">
    <path d="M400,592 L596,592"/><path d="M578,580 L602,592 L578,604"/>
  </g>
  <text x="500" y="742" font-family="{F}" font-size="112" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="4">SAN JUAN</text>
  <text x="500" y="856" font-family="{F}" font-size="84" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="20">2026</text>
</g></svg>''', "sticker-san-juan", (350,150,300))

# 5 · Sub 13 Femenina
render(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}">{CLIP}<g clip-path="url(#tro)">
  <circle cx="500" cy="500" r="472" fill="{ROJO}"/>
  <circle cx="500" cy="500" r="442" fill="none" stroke="{BLANCO}" stroke-width="9"/>
  <text x="500" y="212" font-family="{F}" font-size="52" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="14">INTERNACIONAL</text>
  <rect x="96" y="566" width="808" height="248" fill="{NEGRO}"/>
  <text x="500" y="700" font-family="{F}" font-size="140" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="8">SUB 13</text>
  <text x="500" y="788" font-family="{F}" font-size="72" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="18">FEMENINA</text>
  <text x="500" y="900" font-family="{F}" font-size="44" font-weight="bold"
        fill="{BLANCO}" text-anchor="middle" letter-spacing="10">LO ESPEJO</text>
</g></svg>''', "sticker-sub13", (365,252,270))
print("listo")
