import Image from "next/image";
import Switch from "./components/Switch";
import Sensor1 from "./components/Sensor1";
import PinStatusChart from "./components/PinStatusChart";
import MotorControl from "./components/MotorControl";


export default function Home() {
  return (
    <main className="flex min-h-screen  w-screen flex-col items-center justify-center  p-24">
      {/* <Switch /> */}
      {/* <Sensor1 /> */}
      {/* <PinStatusChart /> */}
      <MotorControl />
    </main>
  );
}
