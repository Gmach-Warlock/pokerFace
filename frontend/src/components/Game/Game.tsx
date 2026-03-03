import Card from "../Card/Card";

export default function Game() {
  return (
    <div className="font-hennyPenny text-center bg-cyan-500 h-[90vh] flex flex-col justify-evenly items-center">
      <h1 className="text-7xl m-1 text-shadow-lg">Poker Face</h1>

      <Card />
      <p className="p-1 m-1 text-shadow-md">press any key to continue</p>
    </div>
  );
}
