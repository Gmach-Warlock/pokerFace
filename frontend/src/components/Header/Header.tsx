export default function Header() {
  return (
    <header className="flex justify-end gap-2 px-2 bg-white text-gray-700">
      <button type="button">Login</button>
      <button type="button" title="menu-bars" className="justify-self-end">
        <i className="fa-solid fa-bars"></i>
      </button>
    </header>
  );
}
