import "./MainMenu.css";

export default function MainMenu() {
  return (
    <div className="main-menu">
      <h2>Main Menu</h2>
      <div className="main-menu-options-container">
        <form action="/">
          <div className="general-settings">
            <label htmlFor="theme-setting">Theme</label>
            <select
              name="theme-settings"
              id="theme-settings"
              title="theme-settings"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
}
