# VASS Todo-List — API-specifikation

**Status:** Beskriver avsett/krävt beteende (från produktägarens krav) plus vad som faktiskt är
bekräftat genom observation mot produktionsinstansen. Fält markerade "obekräftat" ska verifieras
av utvecklare/testare innan man skriver tester som låser exakt fältnamn eller statuskod.

**Base URL:** `https://vass-todo-list.onrender.com/api/`

Samtliga endpoints nedan är prefixade med `/api`, t.ex. `GET /api/todos`.

**Not om autentisering:** Det finns internt en API-nyckel kopplad till denna tjänst, men den
förvaltas separat och ska **inte** skrivas in i den här filen, i kod eller i någon annan committad
fil i detta repo. Observerat beteende (2026-09-15, manuellt test): `GET /todos` och
`DELETE /todos/:id` fungerade utan `Authorization`-header alls. `POST` har bara testats via
GUI-formuläret, inte som ett direkt autentiserat API-anrop — så POST:s eget autentiseringsbeteende
är **obekräftat**. Enligt produktkravet (NFR-1 i kravspecifikationen) ska ingen endpoint kräva
inloggning/nyckel för normal användning; om något anrop visar sig kräva nyckeln bör det flaggas
som en avvikelse från kravet, inte tystas ner.

## Endpoints

### `GET /todos`

Hämtar samtliga todos i listan.

- **Auth:** Ingen (bekräftat).
- **Svar:** `200 OK`, JSON-array av todo-objekt.
- **Exempel (form, inte exakt bekräftade fältnamn):**

```json
[
  { "id": 1, "text": "Handla mjölk", "completed": false, "name": "Anna" },
  { "id": 2, "text": "qa-testrad-1234", "completed": true, "name": "" }
]
```

Ett tomt `name`-fält (`""`) visas som "Okänd" i GUI:t, men API:et returnerar det obehandlade
värdet — se datamodellen i [`01-kravspecifikation.md`](01-kravspecifikation.md).

### `POST /todos`

Skapar en ny todo.

- **Auth:** Ingen (bekräftat).
- **Body (form, obekräftat exakt fältnamn):** `{ "text": "...", "name": "..." }` — `name` är
  valfritt, max 25 tecken (samma gräns som `PUT`).
- **Svar (bekräftat):** `201 Created`, JSON av den skapade todon inklusive serverdefinierat `id`
  och `completed: false` som standard.
- **Krav på servern:** Tom eller endast blanksteg som text avvisas med `400 Bad Request` (bekräftat).

### `PUT /todos/:id`

Uppdaterar text och/eller klarstatus för en befintlig todo.

- **Auth:** Ingen (bekräftat).
- **Body (form, obekräftat exakt fältnamn):** ett eller flera av
  `{ "text": "...", "completed": true, "name": "..." }`
- **Förväntat svar:** `200 OK`, JSON av den uppdaterade todon.
- **Namngräns (bekräftat):** `name` är begränsat till 25 tecken, samma gräns som gäller vid `POST`
  och i GUI:t. Ett för långt namn avvisas med ett felmeddelande.
- **Okänt/obekräftat:** Vad som händer vid `PUT` mot ett `:id` som inte finns (`404` förväntat,
  men inte bekräftat).

### `DELETE /todos/:id`

Tar bort en todo permanent.

- **Auth:** Kräver `Authorization`-header med API-nyckeln (bekräftat).
- **Svar (bekräftat genom faktisk test):** `200 OK`, `{"success": true}`. Borttagningen är verklig
  — bekräftad genom en efterföljande `GET /todos` som inte längre innehöll raden.
- **Okänt/obekräftat:** Statuskod och svar vid `DELETE` mot ett `:id` som redan är borttaget eller
  aldrig funnits.

## Kända öppna frågor för utvecklarteamet

1. Exakt fältnamn för klarstatus (`completed`/`done`/annat) — lås detta i koden och uppdatera
   detta dokument när det är bekräftat.
2. Om `POST`/`PUT`/`DELETE` någonsin kräver den interna API-nyckeln, under vilka förhållanden.
3. Felbeteende (statuskoder, felmeddelandeformat) för ogiltiga eller obefintliga `:id`.
4. Om `GET /todos` returnerar todos i en garanterad ordning (t.ex. skapelseordning) — detta
   påverkar hur "lägg till syns direkt" (FR-2) kan testas deterministiskt.
5. Exakt längdgräns och trimningsregler för `name`-fältet vid `POST` respektive `PUT`, och om GUI:t
   (som begränsar till 20 tecken i fältet) överensstämmer med vad servern faktiskt tillåter —
   verifiera genom direkta API-anrop innan tester skrivs mot exakta gränsvärden.

## Testhygien vid API-tester

Detta API pekar mot en delad, verklig lista i produktion (`https://vass-todo-list.onrender.com/`)
— det finns ingen separat test- eller staging-miljö. Vid tester mot detta API:

- Prefixa all testdata du skapar med `qa-` (t.ex. `qa-testrad-1234`) så den går att skilja från
  riktiga användares todos.
- Ta bort din egen testdata (`DELETE /todos/:id`) när testet är klart.
- Skriv aldrig över eller radera todos du inte själv skapat — andra testare och den faktiska
  användaren delar samma lista.
