import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import Left from '../components/home/Left';
import Right from '../components/home/Right';
import { useAppStore } from '../store/app';
import { LoadingSpinner } from '../components/ui/spinner';

const Home = () => {
  const { isLoading, loadTasks } = useAppStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      loadTasks: state.loadTasks,
    })),
  );
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  if (isLoading) {
    return (
      <div className="w-full h-screen relative">
        <LoadingSpinner className="absolute left-[50%] top-[50%]" />
      </div>
    );
  }
  return (
    <div className="w-full h-screen p-4 grid grid-cols-5 divide-x">
      <Left />
      <Right />
    </div>
  );
};
export default Home;
