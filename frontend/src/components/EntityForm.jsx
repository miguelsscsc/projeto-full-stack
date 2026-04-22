export const EntityForm = ({
  fields,
  values,
  onChange,
  onSubmit,
  submitLabel,
  onCancel,
}) => (
  <form className="entity-form" onSubmit={onSubmit}>
    <div className="entity-form__grid">
      {fields.map((field) => (
        <label key={field.name}>
          <span>{field.label}</span>
          {field.type === "select" ? (
            <select
              name={field.name}
              value={values[field.name] ?? ""}
              onChange={onChange}
              required={field.required}
            >
              <option value="">Selecione</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={field.name}
              type={field.type || "text"}
              value={values[field.name] ?? ""}
              onChange={onChange}
              required={field.required}
              min={field.min}
              max={field.max}
              step={field.step}
            />
          )}
        </label>
      ))}
    </div>
    <div className="entity-form__actions">
      <button type="submit" className="button button--primary">
        {submitLabel}
      </button>
      {onCancel ? (
        <button type="button" className="button button--ghost" onClick={onCancel}>
          Cancelar
        </button>
      ) : null}
    </div>
  </form>
);
