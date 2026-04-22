export const SectionCard = ({ title, subtitle, children, actions }) => (
  <section className="section-card">
    <div className="section-card__header">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions}
    </div>
    {children}
  </section>
);
