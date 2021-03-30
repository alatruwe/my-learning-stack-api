const express = require("express");
const DashboardService = require("./dashboard-services");
const { requireAuth } = require("../middleware/jwt-auth");

const dashboardRouter = express.Router();

dashboardRouter
  .route("/")
  // get entries
  .all(requireAuth)
  .get((req, res, next) => {
    const user_id = req.user.id;
    DashboardService.getEntries(req.app.get("db"), user_id)
      .then((entries) => {
        res.json(entries);
      })
      .catch(next);
  });

dashboardRouter
  .route("/entry/:entry_id")
  .all(requireAuth)
  .delete((req, res, next) => {
    const { entry_id } = req.params;
    // check if entry exists
    DashboardService.getEntryById(req.app.get("db"), entry_id).then((entry) => {
      if (!entry)
        return res.status(404).json({
          error: { message: `Entry doesn't exist` },
        });
      // if entry, delete
      return DashboardService.deleteEntry(req.app.get("db"), entry_id)
        .then(() => {
          res.status(204).end();
        })
        .catch(next);
    });
  });

module.exports = dashboardRouter;
