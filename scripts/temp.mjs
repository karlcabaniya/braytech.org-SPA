import fs from 'fs';

const json = [];

const newObj = {};

json.forEach(j => {
  const json = JSON.parse(j.json);

  newObj[json.cardId] = json;
});

const path = 'src/data/d1grimoire/pt-br/DestinyGrimoireCardDefinition.json';

fs.writeFileSync(path, JSON.stringify(newObj, null, '  '));