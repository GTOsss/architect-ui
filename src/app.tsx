import React from 'react';
import { setCanvas } from '@store/canvas';
import { onMouseMoveHandler } from '@store/cursorPosition';

const App = () => {
  return (
    <div>
      <canvas ref={setCanvas} onMouseMove={onMouseMoveHandler} />
    </div>
  );
};

export default App;
