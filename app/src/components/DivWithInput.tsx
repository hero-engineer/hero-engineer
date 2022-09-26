import { useState } from 'react';
import { Div } from 'ecu-client';

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool');
  return <Div data-ecu="Function:srccomponentsDivWithInputtsx:DivWithInput_0">
      <Div data-ecu="Function:srccomponentsDivWithInputtsx:DivWithInput_1">Edit me I'm famous</Div>
      <input value={name} onChange={event => setName(event.target.value)} data-ecu="Function:srccomponentsDivWithInputtsx:DivWithInput_2" />
    </Div>;
}

export default DivWithInput;