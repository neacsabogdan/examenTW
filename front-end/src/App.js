
import './App.css';
import {BrowserRouter as Router,Route, Switch} from "react-router-dom";
import Playlists from "./components/Playlist";
import Songs from "./components/Song";

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/song/:id">
            <Songs/>
          </Route>
          <Route path="/">
            <Playlists />
          </Route>

        </Switch>
      </Router>
  );
}

export default App;
