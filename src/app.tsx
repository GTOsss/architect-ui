import React, { useEffect } from 'react';
import { setPixiRoot } from '@store/pixi/pixi';
import { onMouseMoveHandler } from '@store/pixi/cursorPosition';
import { onWheel } from '@store/pixi/scrollPosition';

const App = () => {
  useEffect(() => {
    document.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      document.addEventListener('wheel', onWheel, { passive: false });
    };
  }, []);

  return (
    <div>
      <div ref={setPixiRoot} onMouseMove={onMouseMoveHandler} />
    </div>
  );
};

export default App;
