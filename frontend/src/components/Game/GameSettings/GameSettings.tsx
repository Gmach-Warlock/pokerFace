import "./GameSettings.css";

export default function GameSettings() {
  return (
    <div className="game-settings">
      <h2>Settings</h2>
      <div className="main-menu-options-container">
        <form action="/">
          <div className="general-settings">
            <div className="setting">
              <div>
                <p>Theme</p>
              </div>
              <div>
                <label htmlFor="theme-setting"></label>
                <select
                  name="theme-setting"
                  id="theme-setting"
                  title="theme-setting"
                >
                  <option value="dark">dark</option>
                  <option value="light">light</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
