const TechService = {
  getAllTech(db) {
    return db.from("tech_list").select("name", "id");
  },

  getTechId(db, name) {
    return db
      .from("tech_list")
      .select("id")
      .where("name", name)
      .then(([id]) => id);
  },

  insertNewTech(db, newTech) {
    return db
      .insert(newTech)
      .into("tech_list")
      .returning("*")
      .then(([tech]) => tech);
  },
};

module.exports = TechService;
