// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// Modules to control application life and create native browser window
const domContainer = document.querySelector('main');

new DecibelMeter('too-fucking-loud').listenTo("default", (decibel) => {
  if (decibel > -65.0) {
    window.application.showWarning();
  }
});

ReactDOM.render(React.createElement(() => {
  const [loading, setLoading] = React.useState(true);
  const [displays, setDisplays] = React.useState([]);
  const [selectedDisplay, selectDisplay] = React.useState(null);

  if (!window.application) {
    console.log("Exiting early because application doesn't exist")
    return null;
  }

  if (displays.length > 0 && !selectedDisplay) {
    selectDisplay(displays[1].id);
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDisplays(window.application.getAllDisplays())
      setLoading(false)
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (selectedDisplay) {
      window.application.setSelectedDisplay(selectedDisplay)
    }
  }, [selectedDisplay, displays]);

  if (loading) {
    return <section style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <i className="fas fa-spinner fa-5x fa-pulse"></i>
    </section>;
  }

  return <nav className="panel" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    <p className="panel-heading">
      Displays
    </p>

    <section className="panel-block">
      <section className="buttons is-fullwidth">
        <button className="button is-primary is-outlined is-light" onClick={() => window.application.showAllDisplays()}>
          Show
        </button>

        <button className="button is-danger is-light" onClick={() => window.application.quitApplication()}>
          Quit
        </button>
      </section>
    </section>

    {displays ? displays.map((display) => {
      return <a key={display.id} className={`panel-block ${display.id === selectedDisplay ? "is-active" : ""}`} onClick={() => selectDisplay(display.id)}>
        <span className="panel-icon">
          <i className="fas fa-desktop" aria-hidden="true"></i>
        </span>
        Display #{display.id}
      </a>;
    }) : <p><em>No displays available?</em></p>}
  </nav>;
}), domContainer);
