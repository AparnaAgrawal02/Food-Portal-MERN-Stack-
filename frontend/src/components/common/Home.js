import { useState, useEffect } from "react";

const Home = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setName("WELCOME TO IIITH CANTEEN");
  }, []);

  return <div style={{ textAlign: "center" }}>Happy Eating - {name}</div>;
};

export default Home;
