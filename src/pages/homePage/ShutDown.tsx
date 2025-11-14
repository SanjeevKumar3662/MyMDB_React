import "./ShutDown.css";

export const ShutDown: React.FC = () => {
  return (
    <div className="shutdown-container">
      <h1>Under Maintenance, will be up soon.</h1>
      <h2>Working on:</h2>
      <ol>
        <li>Re-routing old routes</li>
        <li>Adding new api endpoint to the backend routes</li>
        <li>Adding new Movie and Tv lists</li>
        <li>etc.</li>
      </ol>
    </div>
  );
};
