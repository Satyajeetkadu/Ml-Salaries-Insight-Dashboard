import React from 'react';
import './App.css';
import SalaryTable from './components/SalaryTable';
import Chat from './components/Chat';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ML Engineer Salaries Dashboard</h1>
      </header>
      <main className="App-main">
        <SalaryTable />
        <Chat />
      </main>
    </div>
  );
};

export default App;
