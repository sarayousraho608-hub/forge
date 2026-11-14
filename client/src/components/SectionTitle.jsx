export default function SectionTitle({ title, sub }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <div className="bar"><i /><i /></div>
      {sub && <p>{sub}</p>}
    </div>
  );
}
