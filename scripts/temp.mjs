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
import TurndownService from 'turndown';
import entities from 'entities';

const turndownService = new TurndownService();
const langs = ['en', 'de', 'es', 'fr', 'it', 'ja', 'pt-br'];

langs.forEach(l => {
  
  // const def = JSON.parse(fs.readFileSync(`src/data/d1grimoire/${l}/DestinyGrimoireCardDefinition.json`));

  // Object.keys(def).forEach(key => {

  //   // def[key].cardDescription = def[key].cardDescription && entities.decodeHTML(turndownService.turndown(def[key].cardDescription));
  //   // def[key].cardIntro = def[key].cardIntro && entities.decodeHTML(def[key].cardIntro.replace(/<\/?[^>]+(>|$)/g, ""));
  //   // def[key].cardIntroAttribution = def[key].cardIntroAttribution && entities.decodeHTML(def[key].cardIntroAttribution.replace(/<\/?[^>]+(>|$)/g, ""));

  //   // if (def[key].cardIntroAttribution && def[key].cardIntroAttribution[0] === '-') {
  //   //   def[key].cardIntroAttribution = def[key].cardIntroAttribution.replace('-','—');
  //   // }

  //   def[key].cardName = def[key].cardName && entities.decodeHTML(def[key].cardName);

  // });
  
  // fs.writeFileSync(`src/data/d1grimoire/${l}/DestinyGrimoireCardDefinition.json`, JSON.stringify(def, null, '  '));
  
  const def = JSON.parse(fs.readFileSync(`src/data/d1grimoire/${l}/DestinyGrimoireDefinition.json`));

  def.themeCollection = def.themeCollection.map(t => {

    t.themeName = entities.decodeHTML(t.themeName)

    t.pageCollection = t.pageCollection.map(p => {

      p.pageName = entities.decodeHTML(p.pageName)

      return p;
    })

    return t;
  })
  
  fs.writeFileSync(`src/data/d1grimoire/${l}/DestinyGrimoireDefinition.json`, JSON.stringify(def, null, '  '));
  
});