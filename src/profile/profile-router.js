const express = require("express");
const ProfileService = require("./profile-services");
const TechService = require("../tech-list-services/tech-list-services");
const { requireAuth } = require("../middleware/jwt-auth");

const profileRouter = express.Router();
const jsonBodyParser = express.json();

profileRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    const user_id = req.user.id;
    ProfileService.getUserprofile(req.app.get("db"), user_id)
      .then((profile) => {
        res.json(profile);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { tech1, tech2, tech3 } = req.body;
    const techs = { tech1, tech2, tech3 };
    let techValues = 3;
    const user_id = req.user.id;

    // ------ check if there is at least 1 tech in request -------
    for (const [key, value] of Object.entries(techs))
      if (value === "") {
        //if no data, delete the entry
        techValues -= 1;
        delete techs[key];
      }
    // if there is no data in request
    if (techValues === 0) {
      return res.status(400).json({
        error: `Missing at least 1 tech in request body`,
      });
    }

    // ----- check if tech is in list ------
    let updateTechList = TechService.getAllTech(req.app.get("db")).then(
      (res) => {
        // get list of tech names from tech_list table
        let results = res.map(({ name }) => name);
        // if tech is not in list, insert in tech_list
        for (const [key, value] of Object.entries(techs)) {
          if (!results.includes(value)) {
            let newTech = {};
            newTech.name = value;
            TechService.insertNewTech(req.app.get("db"), newTech).then(() => {
              return res;
            });
          }
        }
      }
    );

    // ----- add  new profile -------
    Promise.all([updateTechList])
      .then(() => {
        for (const [key, value] of Object.entries(techs)) {
          TechService.getTechId(req.app.get("db"), value).then((res) => {
            // insert profile
            const data = { tech_id: res.id, user_id: user_id };

            ProfileService.insertProfile(req.app.get("db"), data);
          });
        }
      })
      .then(() => {
        ProfileService.getUserprofile(req.app.get("db"), req.user.id).then(
          (profile) => {
            res.status(201).json(profile);
          }
        );
      });
  });

module.exports = profileRouter;
