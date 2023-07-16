import RedirectButton from "../components/redirectButton";
import "../styling/redirectButtonStyle.css";
import "../components/loginButton"
import LoginButton from "../components/loginButton";
import '../styling/Home.css';

function Home() {
  return (
    <div className="App">
      <h1 className="abstractivetitle">Abstractive Health</h1>
      <nav>
        <RedirectButton buttonText="Home" buttonUrl="/home" />
        <RedirectButton buttonText="Upload" buttonUrl="/upload" />
        <RedirectButton buttonText="Customize" buttonUrl="/customize" />
        <RedirectButton buttonText="Annotate" buttonUrl="/annotate" />
        <RedirectButton buttonText="Download" buttonUrl="/download" />
        <RedirectButton buttonText="Admin" buttonUrl="/admin" />
        <h4 className="centered">
        Abstractive Health allows physicians to spend less time reading and writing their clinical notes and improves their revenue reimbursement from insurance companies. Our automated patient summary is a game-changer as it improves interoperability so patients receive better care. Anote's annotation interface help annotators provide the training data for these LLMs.
        </h4 >
        <h4 className="centered">Get started here:</h4>
      <LoginButton className="button-container"/>

      <button className="button-container ButtonType2">
        <a href="/signup">Sign Up</a>
      </button>
      </nav>
    </div>
  );
}

export default Home;
