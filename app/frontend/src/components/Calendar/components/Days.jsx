import React, {useMemo} from 'react';
import styled from 'styled-components';

const DayChar = styled.span`
  text-transform: uppercase;
  font-weight: 600;
  color: rgb(170, 170, 170);
  width: ${({size}) => size}px;
  //flex: 1;
  padding: .75rem 0;
`;
const Container = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  text-align:center;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
`;


const Days = ({cellSize}) => {
  const days = useMemo(() => {
    const symbols = ['s', 'm', 't', 'w', 't', 'f', 's'];
    return symbols.map((label, index) => <DayChar size={cellSize.size} key={index}>{label}</DayChar>);
  });
  return <Container>{days}</Container>;
};

export default Days;
