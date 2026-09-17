# VASS Todo-List — Kravspecifikation

**Status:** Levande dokument. Beskriver kraven för den levererade MVP:n på
`https://vass-todo-list.onrender.com/`.
**Målgrupp:** Utvecklare och testare som bygger, ändrar eller testar appen.
**Bakgrund/varför:** Se [`00-affarside-och-vision.md`](00-affarside-och-vision.md).
**Relaterat:** Detta dokument beskriver *produktkraven*. Testhygien vid API-tester (regler för
testdata mot den delade, verkliga instansen) finns i
[`02-api-specifikation.md`](02-api-specifikation.md#testhygien-vid-api-tester).

## 1. Omfattning

VASS Todo-List är en enda delad att-göra-lista, tillgänglig via webb-GUI och REST-API, utan
inloggning eller användarseparation. En instans av appen = en lista, delad av alla som besöker
den.

## 2. Terminologi

| Begrepp | Betydelse |
|---|---|
| Todo | En rad i listan: text + klarmarkering + unikt id. |
| Delad lista | Det finns bara en lista. Alla klienter läser/skriver mot samma data. |
| Klient | Webb-GUI:t eller ett direktanrop mot REST-API:t. |

## 3. Funktionella krav

### 3.1 Skapa todo

- **FR-1:** En användare ska kunna lägga till en ny todo genom att skriva text i ett textfält och
  bekräfta (knapp eller Enter).
- **FR-2:** En nyskapad todo ska omedelbart synas i listan, både för den klient som skapade den
  och för andra klienter efter omladdning.
- **FR-3:** En ny todo ska som standard vara omarkerad (inte klar).
- **FR-4:** Tom text (efter trimning av mellanslag) ska inte skapa en todo.

### 3.2 Visa todos

- **FR-5:** `GET /todos` och webb-GUI:t ska visa samtliga todos i listan, oavsett vem som skapade
  dem — det finns ingen filtrering per användare.
- **FR-6:** Varje todo ska visas med sin text och sin klarstatus.

### 3.3 Markera som klar / redigera

- **FR-7:** En användare ska kunna markera en todo som klar via en blå checkbox.
- **FR-8:** En klarmarkerad todo ska visuellt skilja sig från en omarkerad (t.ex. genomstruken text
  och/eller ifylld blå checkbox).
- **FR-9:** En användare ska kunna avmarkera en todo som redan är klar (växla tillbaka).
- **FR-10:** En användare ska kunna redigera texten på en befintlig todo.

### 3.4 Ta bort todo

- **FR-11:** En användare ska kunna ta bort en todo permanent via en delete-knapp.
- **FR-12:** En borttagen todo ska försvinna för alla klienter (verifierbart via en efterföljande
  `GET /todos`), inte bara döljas lokalt i den klient som tog bort den.

### 3.5 REST-API

- **FR-13:** `GET /todos` returnerar en lista av samtliga todos som JSON.
- **FR-14:** `POST /todos` skapar en ny todo från JSON-body och returnerar den skapade resursen
  (inklusive tilldelat id) som JSON.
- **FR-15:** `PUT /todos/:id` uppdaterar text och/eller klarstatus för en befintlig todo, och
  returnerar den uppdaterade resursen som JSON.
- **FR-16:** `DELETE /todos/:id` tar bort en todo och returnerar en bekräftelse som JSON.
- **FR-17:** Alla fyra endpoints ska vara funktionellt likvärdiga med motsvarande GUI-handling —
  GUI:t är en klient till samma API, inte en separat väg till datan.

Se [`02-api-specifikation.md`](02-api-specifikation.md) för fält, statuskoder och exempel.

### 3.6 Namn på todo (attribution)

- **FR-18:** En användare ska kunna ange ett valfritt namn kopplat till en todo, som visas tydligt
  tillsammans med todo-texten på lappen.
- **FR-19:** En todo utan angivet namn (eller med tomt namn) ska visas med ett standardvärde
  ("Anonym") istället för ett tomt fält.

## 4. GUI-krav

- **GUI-1:** Ytan som visar todos ska vara orange och post-it-liknande — detta är ett medvetet
  varumärkes-/känslokrav, inte bara estetik (se visionsdokumentet).
- **GUI-2:** Samtliga todos ska rymmas inom en och samma yta/lapp — inga flikar, inga separata
  listor.
- **GUI-3:** Inget konto-, inloggnings- eller profilgränssnitt ska finnas någonstans i GUI:t.
- **GUI-4:** Inga kategori- eller prioriteringskontroller ska finnas i GUI:t (se avgränsningar).

## 5. Icke-funktionella krav

- **NFR-1 (Ingen autentisering):** Applikationen ska inte kräva inloggning för någon funktion,
  vare sig i GUI eller API. Detta är en produktkrav, inte en säkerhetslucka som ska åtgärdas.
- **NFR-2 (Varaktig lagring):** Todos ska lagras varaktigt (överlever serveromstart) — inte bara i
  minnet.
- **NFR-3 (Enkel drift):** Lösningen ska kunna köras och underhållas av en ensam
  hobbyutvecklare/produktägare utan extern databasserver eller komplex infrastruktur.
- **NFR-4 (Enhetlighet mellan klienter):** Alla klienter (webbläsare, direkta API-anrop) ska se
  samma data — det ska inte finnas cachelager som gör att olika klienter ser olika sanningar under
  normal drift.
- **NFR-5 (Svarstider):** Vanliga operationer (hämta, skapa, ändra, ta bort en todo) ska svara
  inom några sekunder under normal drift. Ett känt undantag: gratis hosting kan ha en kall start
  efter inaktivitet (första anropet efter viloläge kan ta längre tid) — detta är en accepterad
  drifts-egenskap, inte en bugg, men bör inte krascha eller time-outa klienten.
- **NFR-6 (Skala):** Appen är dimensionerad för ett litet antal samtidiga användare (hushåll/team),
  inte för hög samtidig belastning. Detta är en medveten avgränsning kopplad till affärsramarna i
  visionsdokumentet, inte en brist som ska åtgärdas utan uttrycklig begäran.

## 6. Datamodell

En todo har minst följande fält:

| Fält | Typ | Beskrivning |
|---|---|---|
| `id` | sträng/nummer | Unikt, tilldelas av servern vid skapande. Klienten ska inte behöva sätta detta själv. |
| `text` | sträng | Todo-texten. Får inte vara tom efter trimning. |
| `completed` | boolean | Klarstatus. Fältnamnet är bekräftat och låst — API:et returnerar alltid `completed`. |
| `name` | sträng | Valfritt namn/attribution kopplat till todon (se FR-18/FR-19). Visas som "Okänd" i GUI:t om tomt. |

`name`-fältet är begränsat till 25 tecken i GUI:t, och samma gräns gäller konsekvent för både
`POST` och `PUT` mot API:et.

## 7. Uttryckliga avgränsningar (medvetet UTANFÖR scope)

Dessa är **inga saknade funktioner** — de är produktbeslut. En bugrapport eller feature-request
som föreslår att lägga till någon av dessa ska avslås med hänvisning till detta dokument, inte
byggas in i tysthet:

- Ingen inloggning, inga användarkonton, ingen behörighetsnivå.
- Ingen per-användare-vy — listan är global och delad av alla.
- Inga kategorier eller taggar.
- Ingen prioritering eller sortering utöver ordningen todos skapades i.
- Inga flera listor per instans.
- Ingen historik/ångra-funktion utöver vad som naturligt följer av redigering/borttagning.
- Inga notifikationer eller påminnelser.

**Notera om `name`-fältet (FR-18/FR-19):** Detta är ett fritt textfält kopplat till en todo, inte
ett användarkonto. Det kräver ingen inloggning, ger ingen behörighet och skapar ingen
per-användare-vy — vem som helst kan skriva vilket namn som helst, eller inget alls. Det bryter
därför inte mot avgränsningarna ovan.

## 8. Acceptanskriterier (per funktion)

| Krav | Acceptanskriterium |
|---|---|
| FR-1, FR-2 | Given en tom lista, when en användare skriver text och bekräftar, then dyker en ny todo med den texten upp i listan för samma klient utan omladdning. |
| FR-4 | Given tomt eller endast blanksteg i textfältet, when användaren försöker skapa en todo, then skapas ingen ny todo och listan är oförändrad. |
| FR-7, FR-8 | Given en omarkerad todo, when användaren klickar den gröna checkboxen, then visas todon som klar (visuellt) och detta kvarstår efter omladdning av sidan. |
| FR-11, FR-12 | Given en befintlig todo, when användaren klickar delete, then försvinner todon för den klienten, och en separat, fristående `GET /todos`-anropad efteråt visar att todon inte längre finns. |
| FR-13–FR-16 | Given ett direkt API-anrop utan att gå via GUI:t, when GET/POST/PUT/DELETE görs mot `/todos`, then beter sig varje anrop enligt tabellen i avsnitt 3.5 och returnerar giltig JSON med relevant statuskod. |
| FR-18, FR-19 | Given en todo utan angivet namn, when den visas i GUI:t, then visas "Okänd" istället för ett tomt fält. Given en todo med angivet namn, when den visas, then syns namnet tydligt tillsammans med todo-texten. |

## 9. Definition of Done för en ändring i denna app

En ändring anses klar när:

1. Den uppfyller de funktionella och icke-funktionella krav som är relevanta för ändringen.
2. Den bryter inte mot någon punkt i avsnitt 7 (avgränsningar) utan att detta dokument uppdaterats
   *först*, med en medveten motivering.
3. GUI och API är verifierat konsekventa (en ändring gjord via ena vägen syns via den andra).
4. Testning har skett mot den delade produktionsinstansen enligt testhygienreglerna i
   [`02-api-specifikation.md`](02-api-specifikation.md#testhygien-vid-api-tester) — dvs. utan att
   skriva över eller radera andras data.
