const express = require("express");
const router  = express.Router({mergeParams: true});
const middleware = require("../middleware");
const comments = require("../controllers/comments");               

router.get("/new",middleware.isLoggedIn, comments.newComment);
router.post("/", middleware.isLoggedIn, comments.createComment);
router.get("/:comment_id/edit", middleware.checkCommentOwnership, comments.editComment);
router.put("/:comment_id", middleware.checkCommentOwnership, comments.updateComment);
router.delete("/:comment_id", middleware.checkCommentOwnership, comments.deleteComment);

module.exports = router;