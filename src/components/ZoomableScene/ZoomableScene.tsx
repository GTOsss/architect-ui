import { setSelfZoom, setShift } from '@store/zoom/zoom';
import React, { useRef, useState, WheelEvent } from 'react';
import styles from './ZoomableScene.module.scss';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ZoomableScene = ({ children, className = null }: Props) => {
  const [zoom, setZoom] = useState(1);
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const ref = useRef(null);

  const handleOnWheel = (e: WheelEvent<HTMLDivElement>) => {
    const { deltaY, clientX, clientY, ctrlKey, shiftKey } = e;
    if (ctrlKey) {
    //   e.preventDefault();
    //   const newZoom = zoom - deltaY / 1000;

    //   const inX = clientX - (clientX - X) / zoom;
    //   const inY = clientY - (clientY - Y) / zoom;
    //   setX(clientX - clientX * newZoom + inX * newZoom);
    //   setY(clientY - clientY * newZoom + inY * newZoom);
    //   setShift({
    //     X: clientX - clientX * newZoom + inX * newZoom,
    //     Y: clientY - clientY * newZoom + inY * newZoom,
    //   });
    //   setSelfZoom(newZoom);
    //   setZoom(newZoom);
    // } else if (shiftKey) {
    //   const newScroll = X + deltaY / 5;
    //   setX(newScroll);
    // } else {
    //   const newScroll = Y - deltaY / 5;
    //   setY(newScroll);
    }
  };

  return (
    <div className={className} onWheel={handleOnWheel}>
      <div
        style={{
          transform: `translate(${X}px, ${Y}px) scale(${zoom})`,
          transition: '0.1s',
          transformOrigin: 'top left',
        }}
        ref={ref}
        className={styles.Container}
      >
        {children}
      </div>
    </div>
  );
};

export default ZoomableScene;
