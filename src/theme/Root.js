import React from 'react';
import SquirrelEasterEgg from '@site/src/components/SquirrelEasterEgg';
import SquirrelTerminal from '@site/src/components/SquirrelTerminal';

/* 包住全站，讓彩蛋在每一頁都有效 */
export default function Root({children}) {
  return (
    <>
      {children}
      <SquirrelEasterEgg />
      <SquirrelTerminal />
    </>
  );
}
