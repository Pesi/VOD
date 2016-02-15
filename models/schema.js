

// core metadata schema

var defCoreMetadataSchema = {
  provider: String,
  defaultlocale: String,
  studioReleaseTitle: String,
  localizedinfo: [{
    locale: String,
    title: String,
    titleSort: String,
    synopsisShort: String,
    synopsisLong: String
  }],
  releaseDate: Date,
  releaseYear: Number,
  productionCompany: String,
  country: String,
  originalSpokenLanguage: String,
  upc: String,
  isan: String,
  ratings: [{
    country: String,
    system: String,
    rating: String
  }],
  genres: [{
    genreCode: String,
    genre: String
  }],
  people: [{
    character: String,
    name: String
  }]
};


module.exports.defCoreMetadataSchema = defCoreMetadataSchema;
