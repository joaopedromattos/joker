import { denormalize, schema } from "normalizr";
import axios from "axios";

const idRemover = lists => {
    return lists.map(element => {
        let aux = element;
        delete aux["_id"];
        return aux;
    });
};

// Persist the board to the database after almost every action.
const persistMiddleware = store => next => action => {
    console.log("Current ACTION:", action.type);
    next(action);
    const {
        user,
        boardsById,
        listsById,
        cardsById,
        currentBoardId: boardId
    } = store.getState();

    // Nothing is persisted for guest users
    //if (user) {
    if (action.type === "DELETE_BOARD") {
        axios.delete("/api/board", { data: { boardId } });

        // All action-types that are not DELETE_BOARD or PUT_BOARD_ID_IN_REDUX are currently modifying a board in a way that should
        // be persisted to db. If other types of actions are added, this logic will get unwieldy.
    } else if (action.type !== "PUT_BOARD_ID_IN_REDUX") {
        // Transform the flattened board state structure into the tree-shaped structure that the db uses.
        const card = new schema.Entity("cardsById", {}, { idAttribute: "_id" });
        const list = new schema.Entity(
            "listsById",
            { cards: [card] },
            { idAttribute: "_id" }
        );
        const board = new schema.Entity(
            "boardsById",
            { lists: [list] },
            { idAttribute: "_id" }
        );
        const entities = { cardsById, listsById, boardsById };

        let boardData = denormalize(boardId, board, entities);


        if (boardData != undefined) {
            // We'll remove all the ids, since the database will replace them with correct ones.
            boardData["lists"] = idRemover(boardData["lists"]);

            // TODO: Provide warning message to user when put request doesn't work for whatever reason
            if (action.type === "BOARD_VALIDATED") {
                console.log("BOARD_VALIDATED!", boardData);
                boardData.valid = true;
                axios
                    .put(
                        process.env.REACT_APP_ADMIN_API +
                        "/boards/_id=" +
                        boardData._id,
                        boardData
                    )
                    .then(result => {
                        res.send(result.data);
                    })
                    .catch(err => {
                        res.send(err.data);
                    });
            }
        }
        console.log("Board data from MiddleWare", boardData);
    }
    //}
};

export default persistMiddleware;
