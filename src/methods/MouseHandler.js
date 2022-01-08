export default function (scene, { onClick, onDblClick }) {
  let startX = 0;
  let startY = 0;
  let clickNo = 0;
  let lastClickTS = 0;
  let doubleClickDelayMs = 200;
  let timeFromLastClick = doubleClickDelayMs;
  let isDoubleClick = false;

  scene.onPointerDown = () => {
    startX = scene.pointerX;
    startY = scene.pointerY;
  };

  scene.onPointerUp = (e) => {
    if (
      Math.abs(scene.pointerX - startX) + Math.abs(scene.pointerY - startY) >
      1
    ) {
      return;
    } else {
      timeFromLastClick = e.timeStamp - lastClickTS;
      isDoubleClick = timeFromLastClick < doubleClickDelayMs;
      clickNo++;
      console.log("PU", clickNo, timeFromLastClick);

      if (isDoubleClick) {
        console.log("double click", clickNo, timeFromLastClick, e.timeStamp);
      } else {
        // let mousePositionInTimeOfTheClick = {
        //   pointerX: scene.pointerX,
        //   pointerY: scene.pointerY,
        // };
        setTimeout(() => {
          if (!isDoubleClick) {
            console.log("click", clickNo);
            onClick();
          } else {
            console.log("double click", clickNo);
            onDblClick();
          }
        }, doubleClickDelayMs);
      }

      lastClickTS = e.timeStamp;
    }
  };
}
