const DashboardService = {
  getEntries(db, user_id) {
    return db
      .from("entries")
      .select(
        "date",
        "current_mood",
        "tech_id",
        "learning_notes",
        "struggling_notes"
      )
      .where("user_id", user_id);
  },

  getEntryById(db, entry_id) {
    return db.from("entries").where("id", entry_id).first();
  },

  deleteEntry(db, entry_id) {
    return db.from("entries").where("id", entry_id).delete();
  },
};

module.exports = DashboardService;
