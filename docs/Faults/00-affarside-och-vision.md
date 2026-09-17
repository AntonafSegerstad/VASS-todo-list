# VASS Todo-List — Idé och vision

**Författare:** Produktägare (idégivare till VASS Todo-List)
**Status:** Levererad MVP, i produktion på `https://vass-todolist.onrender.com/`
**Syfte med dokumentet:** Förklara *varför* appen finns och vilket problem den löser, som grund för kravspecifikationen som utvecklare och testare ska jobba mot.

## Bakgrund

Jag har suttit med för många "delade" att-göra-listor genom åren — anteckningsappar, kalkylark,
chattrådar där folk skriver "kan någon köpa mjölk" och det försvinner i bruset efter tio nya
meddelanden. Alla dessa lösningar har samma problem: de är byggda för något annat
(dokumentredigering, meddelanden, projektledning) och att-göra-listan blir en eftertanke.

Jag ville ha *precis* en sak: en lapp på kylskåpsdörren, men digital och delad. Inget konto att
skapa, ingen app att installera, ingen inloggning att komma ihåg. Man öppnar en länk, ser vad som
ska göras, kryssar av eller lägger till, och stänger fliken igen.

## Idén

**VASS Todo-List** är en minimal, delad att-göra-lista utan inloggning. Alla som har länken ser
och redigerar samma lista i realtid (via omladdning). Det finns ingen personlig vy, inga konton,
inga behörigheter — precis som en fysisk post-it-lapp som ligger framme där alla i hushållet/teamet
kan se den.

Namnet och den visuella idén — en gul post-it-liknande yta — är medveten: appen ska *kännas* som
den fysiska lappen den ersätter, inte som ett "task management-verktyg".

## Målgrupp

- Hushåll och familjer som vill dela en gemensam att-göra-lista (handla, ärenden, hushållssysslor).
- Mindre team eller vängrupper som vill ha en snabb, friktionsfri delad lista för ett gemensamt
  projekt eller event, utan att sätta upp konton i ett tyngre verktyg.
- Alla som tycker att Todoist, Trello eller Asana är för mycket verktyg för för lite behov.

## Varför enkelhet är kärnvärdet — inte en begränsning

Det är medvetet att appen **saknar** inloggning, kategorier, prioritering, delade/separata listor,
notifikationer och historik. Varje sådan funktion är en sak till att lära sig, en sak till att
klicka förbi, och en sak till som kan gå sönder. Om appen någon gång känns för enkel för ett
användningsfall, är svaret "använd ett annat verktyg" — inte "lägg till fler funktioner här".

Detta är en explicit produktbeslut, inte en lucka i kraven. Utvecklare och testare ska betrakta
frånvaron av dessa funktioner som en **spec**, inte som ofullständigt arbete. Se
[`01-kravspecifikation.md`](01-kravspecifikation.md), avsnittet "Uttryckliga avgränsningar".

## Vad framgång ser ut som

- En ny användare förstår appen inom 5 sekunder utan förklaring.
- Ingen användare behöver någonsin fråga "hur loggar jag in?" — för det finns inget att logga in på.
- Listan är alltid tillgänglig och alltid samma för alla — ingen användare ser en annan version av
  sanningen än någon annan.
- Data överlever omstarter och serveromstarter (varaktig lagring), även om appen själv är enkel.

## Affärsmässiga ramar (för sammanhang, inte krav)

Detta är ett litet, icke-kommersiellt projekt (inga betalande kunder, ingen SLA gentemot tredje
part). Det påverkar prioriteringen av icke-funktionella krav: driftskostnad och enkelhet i drift
väger tyngre än till exempel skalbarhet till många samtidiga användare eller hög tillgänglighet
med failover. Se kravspecifikationens avsnitt om icke-funktionella krav för hur detta konkret
påverkar kraven.
