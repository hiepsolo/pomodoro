import Left from '../components/home/Left';
import Right from '../components/home/Right';

const Home = () => {
  return (
    <div className="w-full h-screen p-4 grid grid-cols-5 divide-x">
      <Left />
      <Right />
    </div>
  );
};

export default Home;
