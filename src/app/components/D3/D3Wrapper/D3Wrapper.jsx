import React from "react";
import * as d3 from "d3";
import './D3Wrapper.scss';
import PropTypes from 'prop-types';

const D3Wrapper = (props) => {
    return (
        <div className={props.wrapperName}>
            <svg width={props.width} height={props.height}>
                {
                    props.children
                }
            </svg>
        </div>
    )
}

D3Wrapper.propTypes = {
    wrapperName : PropTypes.string,
    width : PropTypes.number,
    height : PropTypes.number, 
    children : PropTypes.element
}

export default D3Wrapper;