# Dokumentation — VASS Todo-List

Produktdokumentation för QA-målet VASS Todo-List, skriven ur produktägarens perspektiv som grund
för utvecklare och testare. Detta kompletterar den befintliga `../QA_SPEC.md` (det bindande
testkontraktet mot den delade produktionsinstansen) och `../target.json` (den maskinläsbara
target-profilen) — läs inte dessa dokument som en ersättning för varandra.

| Dokument | Innehåll |
|---|---|
| [`00-affarside-och-vision.md`](00-affarside-och-vision.md) | Varför appen finns, målgrupp, produktvision. Läs detta först för att förstå *varför* kraven ser ut som de gör. |
| [`01-kravspecifikation.md`](01-kravspecifikation.md) | Bindande funktionella och icke-funktionella krav, datamodell, uttryckliga avgränsningar, acceptanskriterier. |
| [`02-api-specifikation.md`](02-api-specifikation.md) | REST-API:ets endpoints, förväntat kontra bekräftat beteende, öppna frågor. |
| [`../QA_SPEC.md`](../QA_SPEC.md) | Testhygien och testkontrakt mot den delade, verkliga instansen (redan existerande, ej duplicerat här). |
| [`../NOTES.md`](../NOTES.md) | Loggade fynd från manuella/verktygskörda tester (selektorer, bekräftat API-beteende). |

## Läsordning för en ny utvecklare/testare

1. `00-affarside-och-vision.md` — förstå syftet.
2. `01-kravspecifikation.md` — förstå kraven och de medvetna avgränsningarna.
3. `02-api-specifikation.md` — förstå API:et och vad som fortfarande är obekräftat.
4. `../QA_SPEC.md` — förstå testreglerna innan du rör den delade, verkliga listan.
