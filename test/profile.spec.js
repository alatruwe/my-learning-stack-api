const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe.only("Profile Endpoint", function () {
  let db;

  const {
    testUsers,
    testProfiles,
    testTechList,
  } = helpers.makeLibraryFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () =>
    db.raw("TRUNCATE tech_list, users, profiles RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE tech_list, users, profiles RESTART IDENTITY CASCADE")
  );

  describe(`POST /api/profile`, () => {
    beforeEach(() => helpers.seedUsers(db, testUsers));

    it(`creates a profile, responding with 201 and the new profile`, function () {
      const newProfile = {
        name: "Test profile",
      };
      return supertest(app)
        .post("/api/profile")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newProfile)
        .expect(201)
        .expect((res) =>
          db
            .from("profiles")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then((row) => {
              expect(row.name).to.eql(newProfile.name);
              expect(row.user_id).to.eql(newProfile.user_id);
            })
        );
    });
  });
});