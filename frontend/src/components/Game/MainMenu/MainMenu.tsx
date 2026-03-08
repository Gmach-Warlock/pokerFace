import "./MainMenu.css";

export default function MainMenu() {
  return (
    <div className="main-menu bg-cyan-500 h-100">
      <h2>Main Menu</h2>
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
