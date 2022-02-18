import React, { useEffect } from 'react';
import { useStore } from 'effector-react';
import CommonScene from '@components/commonScene';
import Layout from '@components/Layout';
import { $atomMap, $moduleMap } from '@store/sourceMaps';
import { $canvasJSON, $JSON } from '@store/fabric/canvasJSON';
import { initApp } from '@store/fabric/fabric';

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
