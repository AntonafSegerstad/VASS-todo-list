# Dokumentation — VASS Todo-List

Produktdokumentation för VASS Todo-List, skriven ur produktägarens perspektiv som grund för
utvecklare och testare av detta repo.

| Dokument | Innehåll |
|---|---|
| [`00-affarside-och-vision.md`](00-affarside-och-vision.md) | Varför appen finns, målgrupp, produktvision. Läs detta först för att förstå *varför* kraven ser ut som de gör. |
| [`01-kravspecifikation.md`](01-kravspec.md) | Bindande funktionella och icke-funktionella krav, datamodell, uttryckliga avgränsningar, acceptanskriterier. |
| [`02-api-specifikation.md`](02-api-specifikation.md) | REST-API:ets endpoints, förväntat kontra bekräftat beteende, öppna frågor. |

## Läsordning för en ny utvecklare/testare

1. `00-affarside-och-vision.md` — förstå syftet.
2. `01-kravspecifikation.md` — förstå kraven och de medvetna avgränsningarna.
3. `02-api-specifikation.md` — förstå API:et och vad som fortfarande är obekräftat.
4. Testa mot den delade produktionsinstansen (`https://vass-todo-list.onrender.com/`) utan att
   skriva över eller radera andra testares data — t.ex. genom att prefixa egen testdata (`qa-...`)
   och städa upp efteråt.
