import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchModal from './components/SearchModal';

function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Navbar onSearchClick={() => setSearchOpen(true)} />
      <Outlet />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default App;
