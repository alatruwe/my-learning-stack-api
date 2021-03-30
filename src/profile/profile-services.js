const ProfileService = {
  insertProfile(db, newProfile) {
    return db
      .insert(newProfile)
      .into("profiles")
      .returning("*")
      .then(([profile]) => profile);
  },

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

  getUserprofile(db, user_id) {
    return db
      .where("profiles.user_id", user_id)
      .from("profiles")
      .join("tech_list", "profiles.tech_id", "tech_list.id")
      .select("tech_list.name");
  },
};

module.exports = ProfileService;
