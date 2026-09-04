import { Router } from "express";
import { boardController } from "./board.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// All board routes require authentication
router.use(authMiddleware);

router.post("/", boardController.createBoard);
router.get("/", boardController.getUserBoards);
router.get("/:boardId", boardController.getBoardById);
router.patch("/:boardId", boardController.updateBoard);
router.delete("/:boardId", boardController.deleteBoard);

router.get("/:boardId/members", boardController.getBoardMembers);
router.post("/:boardId/members", boardController.addBoardMember);
router.delete("/:boardId/members/:userId", boardController.removeBoardMember);

export const boardRoutes = router;
