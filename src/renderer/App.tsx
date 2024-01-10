import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Button } from '@/renderer/components/ui/button';

function Hello() {
  return (
    <div>
      <h1 className="bg-gray-500 text-center text-white">
        Hi Tailwind has been integrated.
      </h1>
      <Button>Button</Button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
