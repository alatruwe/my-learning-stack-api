const ProfileService = {
  insertProfile(db, newProfile) {
    return db
      .insert(newProfile)
      .into("profiles")
      .returning("*")
      .then(([profile]) => profile);
  },

  findProfile(db, profile) {
    return db
      .where({ user_id: profile.user_id, tech_id: profile.tech_id })
      .from("profiles")
      .returning("*")
      .then(([profile]) => profile);
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
