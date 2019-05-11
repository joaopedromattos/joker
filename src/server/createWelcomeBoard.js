import shortid from "shortid";
import axios from "axios";

const getStudy = (id) => {

  // Building the api url to retrieve all studies...
  let url = "http://localhost:3000/studies/_id=" + id;


  // The api requisition itself...
  return axios.get(url)
}

// Give every card in a list an _id and the color white UNLESS those properties already exist
const appendAttributes = list =>
  list.map(card => ({
    color: "white",
    _id: shortid.generate(),
    ...card
  }));

// Generate the initial showcase board that every user and guest gets when they first log in
const createWelcomeBoard = (studyId, callBack, userId) => {
  console.log("StudyID: ", studyId);
  getStudy(studyId).then(res => {
    let study = res.data[0];
    console.log("Get study result: ", study);
  
    // Converting our cards to the format used by our open source code.
    const list1 = study.cards.map((cur, index) => {
      return { text: cur.name }
    });
  
    let board = {
      _id: shortid.generate(),
      title: study.name,
      color: "green",
      lists: [
        {
          _id: 1,
          title: "Arraste um cartão de cada vez",
          cards: appendAttributes(list1)
        },
        {
          _id: shortid.generate(),
          title: "Categoria 1",
          cards: []
        },
      ],
      users: userId ? [userId] : []
    };

    return callBack(board);


  })

};

export default createWelcomeBoard;
