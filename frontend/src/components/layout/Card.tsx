type Props = {
  title: string;
};

export default function Card({ title }: Props) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        textAlign: "center",
        width: "250px",
      }}
    >
      <h2>{title}</h2>
      <button>Open</button>
    </div>
  );
}