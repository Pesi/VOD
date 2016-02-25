

// core metadata schema

var defCoreMetadataSchema = {
  provider: String,
  defaultlocale: String,
  studioReleaseTitle: String,
  localizedinfo: [{
    locale: String,
    title: String,
    titleSort: {type:String, default:''},
    synopsisShort: {type:String, default:''},
    synopsisLong: String
  }],
  releaseDate: Date,
  releaseYear: Number,
  productionCompany: String,
  country: String,
  originalSpokenLanguage: String,
  upc: {type:String, default:''},
  isan: {type:String, default:''},
  ratings: [{
    country: String,
    system: String,
    rating: String
  }],
  genres: [{
    genreCode: {type:String, default:''},
    genre: String
  }],
  people: [{
    character: String,
    name: String
  }],
  status:{
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
  }
};


module.exports.defCoreMetadataSchema = defCoreMetadataSchema;
