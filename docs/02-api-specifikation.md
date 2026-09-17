# VASS Todo-List — API-specifikation

**Status:** Beskriver avsett/krävt beteende (från produktägarens krav) plus vad som faktiskt är
bekräftat genom observation mot produktionsinstansen. Fält markerade "obekräftat" ska verifieras
av utvecklare/testare innan man skriver tester som låser exakt fältnamn eller statuskod.

**Base URL:** `https://vass-todo-list.onrender.com/`

**Not om autentisering:** Det finns internt en API-nyckel kopplad till denna tjänst, men den
förvaltas separat och ska **inte** skrivas in i den här filen eller i något annat
toolkit-genererat dokument (se targets-mappens allmänna regel om att hålla nycklar utanför
committade/delade filer). Observerat beteende (2026-09-15, manuellt test): `GET /todos` och
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

- **Auth:** Obekräftat för direkta API-anrop (se not ovan).
- **Body (form, obekräftat exakt fältnamn):** `{ "text": "...", "name": "..." }` — `name` är
  valfritt.
- **Förväntat svar:** `201 Created` (eller `200 OK`), JSON av den skapade todon inklusive
  serverdefinierat `id` och `completed: false` som standard.
- **Krav på servern:** Tom eller endast blanksteg som text ska avvisas (FR-4) — exakt statuskod
  vid avvisning (400 vs. tyst no-op) är obekräftat och bör fastställas av utvecklarteamet.
- **Obekräftat om `name`:** Om och hur `text` trimmas jämfört med `name` (blanksteg i början/slutet)
  samt om det finns någon längdgräns på `name` vid skapande, eller om den eventuellt skiljer sig
  från gränsen som gäller vid `PUT` — se öppna frågor nedan.

### `PUT /todos/:id`

Uppdaterar text och/eller klarstatus för en befintlig todo.

- **Auth:** Obekräftat.
- **Body (form, obekräftat exakt fältnamn):** ett eller flera av
  `{ "text": "...", "completed": true, "name": "..." }`
- **Förväntat svar:** `200 OK`, JSON av den uppdaterade todon.
- **Okänt/obekräftat:** Vad som händer vid `PUT` mot ett `:id` som inte finns (`404` förväntat,
  men inte bekräftat).
- **Obekräftat om `name`:** Om det finns en längdgräns vid uppdatering, om den i så fall
  överensstämmer med gränsen vid skapande (`POST`) eller med GUI:ts fält, samt hur ett för långt
  namn hanteras (avvisas med fel, eller trunkeras tyst) — bör fastställas av utvecklarteamet.

### `DELETE /todos/:id`

Tar bort en todo permanent.

- **Auth:** Ingen (bekräftat).
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

Detta API pekar mot en delad, verklig lista i produktion. All testdata som skapas via detta API
ska följa `qa-`-prefixregeln och tas bort efter testet — se
[`../QA_SPEC.md`](../QA_SPEC.md) för det fullständiga, bindande testkontraktet.
