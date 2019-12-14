import { Router } from "express";
import axios from "axios";

// The methods of this API will consume and encapsulate the use of the other api's methods.
// This will add a little overhead, but will make our functionalities modular.
const api = db => {
    const router = Router();

    // Replace the entire board every time the users modifies it in any way.
    // This solution sends more data than necessary, but cuts down on code and
    // effectively prevents the db and client from ever getting out of sync
    router.put("/board", (req, res) => {
        console.log("Body that went out : req.body ", req.body);
        if (req.body.valid) {
            axios
                .put(
                    process.env.REACT_APP_ADMIN_API +
                    "/boards/_id=" +
                    req.body._id,
                    req.body
                )
                .then(result => {
                    res.send(result.data);
                })
                .catch(err => {
                    res.send(err.data);
                });
        }
    });

    router.delete("/board", (req, res) => {
        // const { boardId } = req.body;
        // boards.deleteOne({ _id: boardId }).then(result => {
        //   res.send(result);
        // });

        if (req.body._id) {
            axios
                .delete(
                    process.env.REACT_APP_ADMIN_API +
                    "/boards/_id=" +
                    req.body._id
                )
                .then(result => {
                    res.send(result.data);
                })
                .catch(err => {
                    res.send(err.data);
                });
        }
    });

    return router;
};

export default api;
