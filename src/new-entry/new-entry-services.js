const NewEntryService = {
  insertEntry(db, newEntry) {
    return db
      .insert(newEntry)
      .into("entries")
      .returning("*")
      .then(([entry]) => entry);
  },
};

module.exports = NewEntryService;
