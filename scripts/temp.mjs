// import fs from 'fs';

// const json = [];

// const newObj = {};

// json.forEach(j => {
//   const json = JSON.parse(j.json);

//   newObj[json.cardId] = json;
// });

// const path = 'src/data/d1grimoire/pt-br/DestinyGrimoireCardDefinition.json';

// fs.writeFileSync(path, JSON.stringify(newObj, null, '  '));

import fs from 'fs';

const TurndownService = require('turndown')

const turndownService = new TurndownService();
const langs = ['en', 'de', 'es', 'fr', 'it', 'ja', 'pt-br'];

langs.forEach(l => {
  
  const def = JSON.parse(fs.readFileSync(`src/data/d1grimoire/${l}/DestinyGrimoireCardDefinition.json`));

  Object.keys(def).forEach(key => {

    def[key].cardDescription = turndownService.turndown(def[key].cardDescription);
    def[key].cardIntro = turndownService.turndown(def[key].cardIntro);
    def[key].cardIntroAttribution = turndownService.turndown(def[key].cardIntroAttribution);

  });
  
  fs.writeFileSync(`src/data/d1grimoire/${l}/DestinyGrimoireCardDefinition.json`, JSON.stringify(def, null, '  '));
  
});