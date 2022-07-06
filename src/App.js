import Todo from './components/todo';
import Header from './components/header';

function App() {

  const data = JSON.parse(localStorage.getItem("tasks")) || [];

  return (
    <>
      <Header />
      <Todo taskData={data} />
    </>

  );
}

export default App;
