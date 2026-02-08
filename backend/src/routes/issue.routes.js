const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const issueController = require("../controllers/issue.controller");

router.use(auth);

router.get("/counts", issueController.statusCounts);
router.get("/", issueController.listIssues);
router.post("/", issueController.createIssue);

router.get("/:id", issueController.getIssue);
router.put("/:id", issueController.updateIssue);
router.patch("/:id/status", issueController.setStatus);
router.delete("/:id", issueController.deleteIssue);

module.exports = router;
