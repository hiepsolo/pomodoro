import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCountdown } from 'usehooks-ts';
import { useAppStore } from '../../store/app';

const toMMSS = (timeInSeconds: number) => {
  let minutes: number | string = Math.floor(timeInSeconds / 60);
  let seconds: number | string = timeInSeconds - minutes * 60;
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
};

const CountDown = () => {
  const { timeLimit, runningTask, finishTask } = useAppStore(
    useShallow((state) => ({
      runningTask: state.runningTask,
      finishTask: state.finishRunning,
      timeLimit: state.config.timeLimit,
    })),
  );
  const [count, { startCountdown, stopCountdown }] = useCountdown({
    countStop: 0,
    intervalMs: 1000,
    countStart: timeLimit * 60,
    isIncrement: false,
  });

  useEffect(() => {
    if (runningTask) {
      if (count === 0) {
        finishTask(runningTask.task);
      } else {
        switch (runningTask.status) {
          case 'paused':
            stopCountdown();
            break;
          default:
            startCountdown();
            break;
        }
      }
    }
  }, [runningTask, startCountdown, stopCountdown, finishTask, count]);

  return (
    <div
      id="count-down"
      className="flex items-center justify-center h-40 w-40 rounded-full border-2 border-slate-600"
    >
      {toMMSS(count)}
    </div>
  );
};

export default CountDown;
