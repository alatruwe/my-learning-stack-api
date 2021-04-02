const DashboardService = {
  getEntries(db, user_id) {
    return db
      .from("entries AS entries")
      .join("tech_list", "entries.tech_id", "tech_list.id")
      .select(
        "entries.date",
        "entries.current_mood",
        "entries.tech_id",
        "entries.learning_notes",
        "entries.struggling_notes",
        "entries.id",
        "tech_list.name"
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
