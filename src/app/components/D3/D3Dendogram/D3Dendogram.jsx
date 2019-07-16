import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';


class D3Dendogram extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        const svg = d3.select(this.refs.anchor);

        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram.json", function(data) {

            // Create the cluster layout:
            var cluster = d3.cluster()
                            .size([this.props.height, this.props.width - 100]);  // 100 is the margin I will have on the right side

            // Give the data to this cluster layout:
            var root = d3.hierarchy(data, function(d) {
                return d.children;
            });

            cluster(root);

            // Add the links between nodes:
            svg.selectAll('path')
                .data( root.descendants().slice(1) )
                .enter()
                .append('path')
                .attr("d", function(d) {
                    return "M" + d.y + "," + d.x
                            + "C" + (d.parent.y + 50) + "," + d.x
                            + " " + (d.parent.y + 150) + "," + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
                            + " " + d.parent.y + "," + d.parent.x;
                        })
                .style("fill", 'none')
                .attr("stroke", '#ccc')


            // Add a circle for each node.
            svg.selectAll("g")
                .data(root.descendants())
                .enter()
                .append("g")
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")"
                })
                .text(function(d) { return d.name; })
                .append("circle")
                    .attr("r", 7)
                    .style("fill", "#69b3a2")
                    .attr("stroke", "black")
                    .style("stroke-width", 2)

        })
    }
    
    render(){
        // Returning null in the case where we just don't have our data...
        if (!this.props.data){
            return null;
        } else {
            // Returning an anchor element into which we'll insert our data...
            return <g ref="anchor" /> 
        }
    }
}

D3Dendogram.propTypes = {
    height : PropTypes.number,
    width : PropTypes.number,
    data : PropTypes.any    
}

export default D3Dendogram;