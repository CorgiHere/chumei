type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  id?: string;
};

export function SectionHeader({ title, subtitle, id }: SectionHeaderProps) {
  return (
    <div className="mb-8" id={id}>
      <h2 className="section-title display-title">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-muted">{subtitle}</p>
      )}
    </div>
  );
}
