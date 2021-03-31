const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Profile Endpoint", function () {
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

  describe(`GET /api/profile`, () => {
    //test when database is empty
    context(`Given no profile`, () => {
      beforeEach(() => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("tech_list").insert(testTechList);
          });
      });
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/profile")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    // test when database has items
    context("Given there are a profile in the database", () => {
      beforeEach("insert new profiles", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db
              .into("tech_list")
              .insert(testTechList)
              .then(() => {
                return db.into("profiles").insert(testProfiles);
              });
          });
      });

      it("responds with 200 and the specified profile", () => {
        return supertest(app)
          .get(`/api/profile/`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200);
      });
    });
  });

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
