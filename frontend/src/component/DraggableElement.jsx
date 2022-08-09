import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import React from "react";
import styled from "styled-components";

const ColumnHeader = styled.div`
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const DroppableStyles = styled.div`
  padding: 10px;
  border-radius: 6px;
  background: #d4d4d4;
`;

// Retunrn a list contains the draggle sing 
const DraggableElement = (props) => {
  return (
    <DroppableStyles>
      <ColumnHeader style={{fontWeight: 'bold'}}>{props.prefix}</ColumnHeader>
      <Droppable droppableId={`${props.prefix}`}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {props.elements.map((item, index) => (
              <ListItem 
                id={item.id} 
                rid={item.rid}
                item={item} 
                index={index} 
                handleDelete={props.handleDelete} 
                prefix={props.prefix}
                list={props.elements}
                setDialogOpen={props.setDialogOpen}
                setClickedItem={props.setClickedItem} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DroppableStyles>
  )
};

export default DraggableElement;
