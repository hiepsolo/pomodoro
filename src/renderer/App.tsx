import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Setup from './screens/setup';
import Home from './screens/home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Setup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};
export default App;
