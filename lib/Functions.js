
const Functions = {
  convertToTitleCase(string) {
    const words = string.toLowerCase().split(' ');
    const firstWord = words[0];
    const capitalizedFirstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    words[0] = capitalizedFirstWord;
    return words.join(' ');
  },
  async setSynonyms(speciesName) {
    try {
      const matchResponse = await fetch(
        `https://api.gbif.org/v1/species/match?verbose=true&rank=species&strict=false&kingdom=Plantae&name=${speciesName}`,
      );
      const matchData = await matchResponse.json();
      const acceptedUsageKey = matchData.acceptedUsageKey ? matchData.acceptedUsageKey : matchData.usageKey;

      const synonymsResponse = await fetch(`https://api.gbif.org/v1/species/${acceptedUsageKey}/synonyms`);
      const synonymsData = await synonymsResponse.json();
      let speciesSplit = speciesName.split(' ');
      let infraesp = '';
      if (speciesSplit.length == 2 && speciesSplit[1].toLowerCase() !== 'sp.') {
        infraesp = speciesSplit[0] + ' ' + speciesSplit[1];
      }
      const synonyms = synonymsData.results.map((result) => {
        let canonicalNamePrepared;
        if (result.canonicalName) {
          if (result.rank === 'VARIETY') {
            const canonicalNameList = result.canonicalName.split(' ');
            canonicalNameList.splice(2, 0, 'var.');
            canonicalNamePrepared = canonicalNameList.join(' ');
          } else if (result.rank === 'SUBSPECIES') {
            const canonicalNameList = result.canonicalName.split(' ');
            canonicalNameList.splice(2, 0, 'subsp.');
            canonicalNamePrepared = canonicalNameList.join(' ');
          } else if (result.rank === 'FORM') {
            const canonicalNameList = result.canonicalName.split(' ');
            canonicalNameList.splice(2, 0, 'f.');
            canonicalNamePrepared = canonicalNameList.join(' ');
          } else if (result.rank === 'SPECIES' || result.rank === 'GENUS') {
            canonicalNamePrepared = result.canonicalName;
          } else {
            const canonicalNameList = result.canonicalName.split(' ');
            canonicalNameList.splice(2, 0, 'ERROR');
            canonicalNamePrepared = canonicalNameList.join(' ');
          }
        } else {
          console.log('Not found.');
        }
        return canonicalNamePrepared;
      });
      const acceptedSpecies = synonymsData.results.map((result) => result.species);
      const uniqueSpecies = [...new Set(acceptedSpecies)];
      synonyms.push(speciesName);
      synonyms.push(uniqueSpecies[0]);
      const speciesInfo = {
        speciesName: speciesName,
        synonyms: synonyms,
        acceptedUsageKey: acceptedUsageKey,
        acceptedSpecies: uniqueSpecies[0],
      };
      return speciesInfo;
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      throw new Error('Se produjo un error al realizar la consulta.');
    }
  },
};
export { Functions };