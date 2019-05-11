import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Board from "./Board";

// This components only purpose is to redirect requests for board pages that don't exist
// or which the user is not authorized to visit, in order to prevent errors
const BoardContainer = props =>
  props.board ? <Board board={props.board} /> : <Redirect to={'/boardAccess/' + props.boardId}  />;


BoardContainer.propTypes = { board: PropTypes.object };

const mapStateToProps = (state, ownProps) => {
  console.log("STATE DENTRO DE BOARDCONTAINER", state, "OWN PROPS: ", ownProps);
  const { boardId } = ownProps.match.params;
  const board = state.boardsById[boardId];
  return { board, boardId };
};

export default connect(mapStateToProps)(BoardContainer);
