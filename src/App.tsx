import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/tv">
            <Search />
          </Route>
          <Route path="/search">
            <Tv />
          </Route>
        </Switch>
      </Router>
    </BrowserRouter>
  );
}

export default App;
