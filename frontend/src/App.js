import RedirectButton from "./components/redirectButton";
import "./styling/redirectButtonStyle.css";
import "./components/loginButton"
import LoginButton from "./components/loginButton";

function App() {
  return (
    <div className="App">
      <h1 className="abstractivetitle">Abstractive Health</h1>
      <nav>
        <RedirectButton buttonText="Home" buttonUrl="/" />
        <RedirectButton buttonText="Upload" buttonUrl="/upload" />
        <RedirectButton buttonText="Customize" buttonUrl="/customize" />
        <RedirectButton buttonText="Annotate" buttonUrl="/annotate" />
        <RedirectButton buttonText="Download" buttonUrl="/download" />
        <RedirectButton buttonText="Admin" buttonUrl="/admin" />
        <LoginButton />
      </nav>
    </div>
  );
}

export default App;
