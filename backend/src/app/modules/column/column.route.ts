import { Router } from "express";
import { columnController } from "./column.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

// Board-scoped column routes: /api/boards/:boardId/columns
const boardColumnRouter = Router({ mergeParams: true });
boardColumnRouter.use(authMiddleware);

boardColumnRouter.post("/", columnController.createColumn);
boardColumnRouter.get("/", columnController.getBoardColumns);
boardColumnRouter.patch("/reorder", columnController.reorderColumns);

// Standalone column routes: /api/columns/:columnId
const columnRouter = Router();
columnRouter.use(authMiddleware);

columnRouter.patch("/:columnId", columnController.updateColumn);
columnRouter.delete("/:columnId", columnController.deleteColumn);

export { boardColumnRouter, columnRouter };
