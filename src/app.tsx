import React, { useEffect } from 'react';
import { useStore } from 'effector-react';
import CommonScene from '@components/commonScene';
import Layout from '@components/Layout';
import { $atomMap, $moduleMap } from '@store/sourceMaps';
import { $canvasJSON, $JSON } from '@store/fabric/canvasJSON';
import { initApp } from '@store/fabric/fabricdev';

const App = () => {
  const atomMap = useStore($atomMap);
  const moduleMap = useStore($moduleMap);
  const canvasJSON = useStore($canvasJSON);
  const json = useStore($JSON);
  const events = { initApp };

  useEffect(() => {
    events.initApp();
  }, []);

  return (
    <div>
      <Layout atomMap={atomMap} moduleMap={moduleMap} canvasJSON={canvasJSON} json={json}>
        <CommonScene />
      </Layout>
    </div>
  );
};

export default App;

// import React, { useEffect } from 'react';
// import { setPixiRoot } from '@store/pixi/pixi';
// import { onMouseMoveHandler } from '@store/pixi/cursorPosition';
// import { onWheel } from '@store/pixi/scrollPosition';
// import cx from 'clsx';
// import { $cursorType } from '@store/pixi/cursorType';
// import { useStore, useEvent } from 'effector-react';
// import { onClickStart } from '@store/pixi/pixiOnClick';

// import { getProjectPathFx } from '@store/path';
// import s from './App.module.scss';

// const App = () => {
//   const cursorType = useStore($cursorType);
//   const events = useEvent({ getProjectPathFx });
//   useEffect(() => {
//     document.addEventListener('wheel', onWheel, { passive: false });

//     events.getProjectPathFx();

//     return () => {
//       document.removeEventListener('wheel', onWheel, { passive: false } as EventListenerOptions);
//     };
//   }, []);

//   return (
//     <div>
//       <div
//         className={cx(s[`pixiRoot__cursor_${cursorType}`])}
//         ref={setPixiRoot}
//         onMouseMove={onMouseMoveHandler}
//         onClick={onClickStart}
//       />
//       <span style={{ position: 'fixed', right: 0, bottom: 0, backgroundColor: 'white' }} id="debug" />
//     </div>
//   );
// };

// export default App;
