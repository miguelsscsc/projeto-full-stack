export const StatCard = ({ label, value }) => (
  <article className="stat-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </article>
);
