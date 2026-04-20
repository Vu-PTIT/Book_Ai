from lunar_python import Solar, EightChar
import datetime

dates = [
    (1984, 1, 1),
    (1990, 1, 1),
    (1966, 1, 1),
    (2024, 1, 1)
]

for y, m, d in dates:
    solar = Solar.fromYmd(y, m, d)
    lunar = solar.getLunar()
    eight_char = lunar.getEightChar()
    print(f"{y}-{m}-{d}: {eight_char.getYearNaYin()}")
