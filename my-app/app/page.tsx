import Image from "next/image";
import axios from "axios"
export default function Home() {
  const creatinguser = async () => {
    const user = await axios.post('/api/user/create', {
      name: "bilal",
      email: "bilalsheikhsb77@gmail.com",
      password: "bilal123",
      id: "1",
      createdat: 1,

    })
    console.log(user)
  }
  return (
    <div className="">
      <button onClick={creatinguser}>create user</button>

    </div>
  );
}
